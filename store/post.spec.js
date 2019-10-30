import { Chance } from 'chance';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import { commentsMsgBuilder } from '../test/comment.mock';
import { PostStore, PostActions, mutations } from './post';
import store from './index';
import { userMockBuilder } from '~/test/user.mock';

const chance = new Chance();

describe('Comment store module', () => {
	const { resetComments, setPostLike } = mutations;
	let root;
	let state;
	let $ws;

	beforeEach(() => {
		const localVue = createLocalVue();
		localVue.use(Vuex);
		$ws = { sendObj: jest.fn() };
		root = new Vuex.Store(store);
		root.state.socket.isConnected = true;
		root.state.merchant.id = 'aDummyMerchantId';
		root.state.socket.$ws = $ws;
		state = {
			items: [],
		};
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
			messages: [ {
				author: me.short(),
				ts: jasmine.any(Number),
				text: comment.text,
			} ],
		});
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

		// commited
		expect(post.likes.count).toBe(count - 1);
		expect(post.likes.byMe).toBe(false);

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
});
