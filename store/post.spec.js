import { Chance } from 'chance';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import { commentsMsgBuilder, commentMockBuilder } from '../test/comment.mock';
import post, { PostStore, PostActions, mutations } from './post';
import store from './index';
import { userMockBuilder } from '~/test/user.mock';
import { Storage } from '~/test/storage.mock';
import { postReported, commentReported } from '~/utils/reportSession';

const chance = new Chance();

describe('Post store module', () => {
	const { postLoaded, resetComments, setPostLike } = mutations;
	let postStore;
	let root;
	let state;
	let $ws;

	beforeEach(() => {
		const localVue = createLocalVue();
		localVue.use(Vuex);
		$ws = { sendObj: jest.fn() };
		postStore = new Vuex.Store(post);
		root = new Vuex.Store(store);
		root.state.socket.isConnected = true;
		root.state.merchant.id = 'aDummyMerchantId';
		root.state.socket.$ws = $ws;
		state = {
			all: [],
		};
	});

	it('should update item guid and ts on load', () => {
		const pendingItem = aDefaultSingleItemMsgBuilder()
			.withCorrelationId(chance.guid())
			.get();

		state.all = [pendingItem];

		const loadedItem = Object.assign({}, pendingItem, { guid: chance.guid(), ts: Date.now() });
		postLoaded(state, loadedItem);
		expect(state.all.length).toBe(1);
		expect(pendingItem.guid).toBe(loadedItem.guid);
		expect(pendingItem.ts).toBe(loadedItem.ts);
	});

	it('should update post comments', () => {
		const post = aDefaultSingleItemMsgBuilder().get();
		const { comments } = commentsMsgBuilder(post.guid).get();

		resetComments({}, { comments, post });

		expect(post.comments.messages).toBe(comments);
	});

	it('should send comment to ws and update post', async () => {
		const me = userMockBuilder();
		root.state.user.me = me;

		const guid = chance.guid();
		const post = aDefaultSingleItemMsgBuilder()
			.withGUID(guid)
			.get();

		const text = chance.sentence();
		const comment = {
			post,
			text,
		};

		await root.dispatch(`${PostStore}/${PostActions.sendComment}`, comment);

		const sendObjInvocationArg = $ws.sendObj.mock.calls[0][0];
		expect(sendObjInvocationArg).toMatchObject({
			guid,
			text,
			type: 'addComment',
		});
		expect(post.comments).toEqual({
			count: 1,
			messages: [{
				author: me.short(),
				ts: jasmine.any(Number),
				text: comment.text,
				byMe: true,
			}],
		});
	});

	it('should delete comment', async () => {
		const me = userMockBuilder();
		root.state.user.me = me;

		const post = aDefaultSingleItemMsgBuilder()
			.withComment()
			.get();

		const comment = post.comments.messages[0];
		comment._id = comment.id;

		await root.dispatch(`${PostStore}/${PostActions.deleteComment}`, { post, comment });

		const sendObjInvocationArg = $ws.sendObj.mock.calls[0][0];
		expect(sendObjInvocationArg).toMatchObject({
			commentId: comment.id,
			type: 'deleteComment',
		});

		const exist = post.comments.messages.find(m => m.id === comment.id);
		expect(exist).toBeFalsy();
	});

	it('should update post like count', () => {
		const post = aDefaultSingleItemMsgBuilder().get();

		state.items = [post];

		const count = chance.natural();
		setPostLike(state, {
			post,
			count,
		});

		expect(state.items.length).toBe(1);
		expect(post.likes.count).toBe(count);
		expect(post.likes.byMe).toBe(undefined);
	});

	it('should update post like byMe', () => {
		const post = aDefaultSingleItemMsgBuilder().get();

		state.items = [post];

		setPostLike(state, {
			post,
			byMe: true,
		});

		expect(state.items.length).toBe(1);
		expect(post.likes.count).toBe(undefined);
		expect(post.likes.byMe).toBe(true);
	});

	it('should toggle like state of post and send message', async () => {
		const count = chance.natural();
		const post = aDefaultSingleItemMsgBuilder()
			.withGUID()
			.withLikes(count, true)
			.get();

		await root.dispatch(`${PostStore}/${PostActions.toggleLike}`, post);

		// send ws message
		expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
			type: 'like',
			guid: post.guid,
			iLike: false,
		});
	});

	it('should prevent send like message while pending upload', async () => {
		const post = aDefaultSingleItemMsgBuilder().get();

		await root.dispatch(`${PostStore}/${PostActions.toggleLike}`, post);

		// commited
		expect(post.likes).not.toHaveProperty('count');
		expect(post.likes).not.toHaveProperty('byMe');

		// send ws message
		expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
	});

	it('should set text of post and send message', async () => {
		const post = aDefaultSingleItemMsgBuilder()
			.withGUID()
			.get();
		const text = chance.sentence();

		await root.dispatch(`${PostStore}/${PostActions.editText}`, { text, post });

		expect(post.text).toBe(text);
		expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith(post.toMessage());
	});

	it('should commit addItem on saveItem', async () => {
		const msg = aDefaultSingleItemMsgBuilder().get();
		const me = userMockBuilder();
		root.state.user.me = me;

		msg.correlationId = jasmine.any(String);
		msg.private = true;
		await root.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
		expect(root.state.post.all).toEqual([{
			...msg,
			byMe: true,
			user: me.short(),
			userId: me.get().userId,
		}]);
	});

	it('should commit addItem when receive new item', async () => {
		const msg = aDefaultSingleItemMsgBuilder().get();

		await postStore.dispatch(`${PostActions.receiveItem}`, msg);
		expect(postStore.state.all).toEqual([msg]);
	});

	it('should strip error, ts, user, comments, likes and merchantId when sending singleItemPost to socket', async () => {
		const msg = aDefaultSingleItemMsgBuilder().get();

		root.state.socket.isAuth = true;
		await root.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);

		expect(root.state.socket.$ws.sendObj).toHaveBeenCalledTimes(1);
		const { byMe, comments, error, likes, merchantId, selected, ts, user, userId, ...clean } = msg;
		clean.correlationId = jasmine.any(String);
		const sendObjInvocationArg = $ws.sendObj.mock.calls[0][0];
		expect(sendObjInvocationArg).toMatchObject(clean);
		expect(sendObjInvocationArg).not.toHaveProperty('ts');
	});

	it('should not send item on save while WS disconnected', async () => {
		root.state.socket.isConnected = false;
		const msg = aDefaultSingleItemMsgBuilder().get();

		await root.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
		expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
	});

	it('should not send item on save while WS not auth', async () => {
		const msg = aDefaultSingleItemMsgBuilder().get();

		await root.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
		expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
	});

	it('should update pending item', async () => {
		const pendingItem = aDefaultSingleItemMsgBuilder()
			.withCorrelationId(chance.guid())
			.get();

		postStore.state.all = [pendingItem];

		const loadedItem = Object.assign({}, pendingItem, { guid: chance.guid(), ts: Date.now() });
		await postStore.dispatch(`${PostActions.receiveItem}`, loadedItem);

		expect(pendingItem).not.toHaveProperty('correlationId');
		expect(pendingItem.guid).toBe(loadedItem.guid);
		expect(pendingItem.ts).toBe(loadedItem.ts);
	});

	it('should report a post', async () => {
		const post = aDefaultSingleItemMsgBuilder().withGUID().get();
		const reason = 'reason';
		const other = 'other';
		global.sessionStorage = new Storage();
		await root.dispatch(`${PostStore}/${PostActions.reportPost}`, { post, reason, other });
		expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
			type: 'report',
			postId: post.postId,
			reason,
			other,
		});
		expect(postReported(post)).toBe(true);
	});

	it('should report a comment', async () => {
		const post = aDefaultSingleItemMsgBuilder().withGUID().get();
		const comment = commentMockBuilder().get();
		comment._id = comment.id;
		post.comments = {
			messages: [comment],
			count: 1,
		};
		const reason = 'spam';
		const other = null;
		global.sessionStorage = new Storage();
		await root.dispatch(`${PostStore}/${PostActions.reportComment}`, { post, comment, reason, other });
		expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
			type: 'report',
			commentId: comment._id,
			reason,
			other,
		});
		expect(post.comments.messages).not.toContain(comment);
		expect(commentReported(comment)).toBe(true);
	});
});
