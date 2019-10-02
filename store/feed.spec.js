import { Chance } from 'chance';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import { commentsMsgBuilder } from '../test/comment.mock';
import feed, { FeedStore, FeedActions, mutations } from './feed';
import { state } from './index';

const chance = new Chance();
const localVue = createLocalVue();
localVue.use(Vuex);

let spy = null;

describe('Feed store module', () => {
	afterEach(() => {
		sessionStorage.clear();
		if (spy) {
			spy.calls.reset();
			spy = null;
		}
	});

	describe('mutations', () => {
		const {
			setItems,
			addItem,
			itemLoaded,
			receiveComments,
			restoreSession,
			setPostLike,
		} = mutations;

		let state;

		beforeEach(() => {
			state = {
				items: [],
			};
		});

		it('should set all items in store', () => {
			const length = Math.floor(Math.random() * 100 + 1);
			const newItems = Array(length);

			setItems(state, newItems);
			expect(state.items).toBe(newItems);
			expect(state.items.length).toBe(length);
		});

		it('addItem should push any item to existing list', () => {
			const newItem = aDefaultSingleItemMsgBuilder().get();

			addItem(state, newItem);
			expect(state.items.length).toBe(1);
			expect(state.items[0]).toBe(newItem);
		});

		it('should update item guid and ts on load', () => {
			const pendingItem = aDefaultSingleItemMsgBuilder()
				.withCorrelationId(chance.guid())
				.get();

			state.items = [pendingItem];

			const loadedItem = Object.assign({}, pendingItem, { guid: chance.guid(), ts: Date.now() });
			itemLoaded(state, loadedItem);
			expect(state.items.length).toBe(1);
			expect(pendingItem.guid).toBe(loadedItem.guid);
			expect(pendingItem.ts).toBe(loadedItem.ts);
		});

		it('should restore from sessionStore on reload', () => {
			const { type, ...storred } = aDefaultSingleItemMsgBuilder().get();
			sessionStorage.setItem(FeedStore, JSON.stringify(storred));

			restoreSession(state);
			expect(state.items[0]).toEqual(storred);
		});

		it('should not restore from sessionStore on jump', () => {
			const current = aDefaultSingleItemMsgBuilder().get();
			state.items = [current];

			const storred = aDefaultSingleItemMsgBuilder().get();
			sessionStorage.setItem(FeedStore, JSON.stringify(storred));

			spy = spyOn(Storage.prototype, 'getItem');

			restoreSession(state);
			expect(sessionStorage.getItem).toHaveBeenCalledTimes(0);
			expect(state.items[0]).toEqual(current);
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

		it('should update post comments', () => {
			const post = aDefaultSingleItemMsgBuilder().get();
			const commentMsg = commentsMsgBuilder(post.guid).get();

			state.items = [post];

			receiveComments(state, commentMsg);

			expect(post.comments.length).toBe(1);
			expect(post.comments).toBe(commentMsg.comments);
		});
	});

	describe('actions', () => {
		let root;
		let feedStore;
		let $ws;

		const aDummyMerchantId = 'aDummyMerchantId';

		beforeEach(() => {
			$ws = { sendObj: jest.fn() };
			feedStore = new Vuex.Store(feed);
			root = new Vuex.Store({
				state,
				modules: {
					feed,
				},
			});
			root.state.socket.isConnected = true;
			root.state.merchant.id = aDummyMerchantId;
			root.state.socket.$ws = $ws;
		});

		it('should commit addItem on saveItem', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			const { type, ...cleanPost } = msg;
			cleanPost.correlationId = jasmine.any(String);
			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.feed.items).toEqual([ cleanPost ]);
		});

		it('should commit addItem when receive new item', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			await feedStore.dispatch(`${FeedActions.receiveItem}`, msg);
			const { type, ...cleanPost } = msg;
			expect(feedStore.state.items).toEqual([ cleanPost ]);
		});

		it('should strip ts, user, comments, likes and merchantId when sending singleItemPost to socket', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			root.state.socket.isAuth = true;
			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);

			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledTimes(1);
			const { merchantId, guid, user, ts, comments, likes, ...clean } = msg;
			clean.correlationId = jasmine.any(String);
			const sendObjInvocationArg = $ws.sendObj.mock.calls[0][0];
			expect(sendObjInvocationArg).toMatchObject(clean);
			expect(sendObjInvocationArg).not.toHaveProperty('ts');
		});

		it('should toggle like state of post, send message, store', async () => {
			const count = chance.natural();
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.withLikes(count, true)
				.get();

			await root.dispatch(`${FeedStore}/${FeedActions.toggleLike}`, post);

			// commited
			expect(post.likes.count).toBe(count - 1);
			expect(post.likes.byMe).toBe(false);

			// send ws message
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
				type: 'like',
				guid: post.guid,
				iLike: false,
			});

			const key = sessionStorage.key(0);
			const storedPost = sessionStorage.getItem(key);
			expect(post.toStore()).toEqual(JSON.parse(storedPost));
		});

		it('should prevent send like message while pending upload', async () => {
			const post = aDefaultSingleItemMsgBuilder().get();

			await root.dispatch(`${FeedStore}/${FeedActions.toggleLike}`, post);

			// commited
			expect(post.likes).not.toHaveProperty('count');
			expect(post.likes).not.toHaveProperty('byMe');

			// send ws message
			expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();

			expect(sessionStorage.length).toBe(0);
		});

		it('should update post likes', async () => {
			const guid = chance.guid();
			const count = chance.natural();
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID(guid)
				.withLikes(count, true)
				.get();

			feedStore.state.items = [post];

			const likes = {
				count: chance.natural(),
				byMe: false,
			};
			await feedStore.dispatch(`${FeedActions.updateLike}`, {
				type: 'like',
				guid,
				likes,
			});

			expect(post.likes.count).toBe(likes.count);
			expect(post.likes.byMe).toBe(likes.byMe);
		});

		it('should not send item on save while WS disconnected', async () => {
			root.state.socket.isConnected = false;
			const msg = aDefaultSingleItemMsgBuilder().get();

			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
		});

		it('should not send item on save while WS not auth', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
		});

		it('should update pending item', async () => {
			const pendingItem = aDefaultSingleItemMsgBuilder()
				.withCorrelationId(chance.guid())
				.get();

			feedStore.state.items = [pendingItem];

			const loadedItem = Object.assign({}, pendingItem, { guid: chance.guid(), ts: Date.now() });
			await feedStore.dispatch(`${FeedActions.receiveItem}`, loadedItem);

			expect(pendingItem).not.toHaveProperty('correlationId');
			expect(pendingItem.guid).toBe(loadedItem.guid);
			expect(pendingItem.ts).toBe(loadedItem.ts);
		});

		it('should not add pending item when store', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();
			const length = sessionStorage.length;

			await feedStore.dispatch(`${FeedActions.storeItem}`, msg);

			expect(feedStore.state.items).toEqual([ msg ]);
			expect(sessionStorage.length).toBe(length);
		});

		it('should add only acknowledged item when store', async () => {
			const msg = aDefaultSingleItemMsgBuilder().withGUID().get();
			const length = sessionStorage.length;

			await feedStore.dispatch(`${FeedActions.storeItem}`, msg);

			expect(feedStore.state.items).toEqual([ msg ]);
			expect(sessionStorage.length).toBe(length + 1);
		});

		it('should add any item and keep limit', async () => {
			function item() {
				return aDefaultSingleItemMsgBuilder()
					.withGUID()
					.get();
			}

			await feedStore.dispatch(`${FeedActions.storeItem}`, item());
			await feedStore.dispatch(`${FeedActions.storeItem}`, item());
			await feedStore.dispatch(`${FeedActions.storeItem}`, item());
			await feedStore.dispatch(`${FeedActions.storeItem}`, item());

			expect(feedStore.state.items.length).toBe(4);
			expect(sessionStorage.length).toBe(3);
		});

		it('should store with no comments', async () => {
			const msg = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.withComment()
				.get();

			await feedStore.dispatch(`${FeedActions.storeItem}`, msg);

			const key = sessionStorage.key(0);
			const storedPost = JSON.parse(sessionStorage.getItem(key));
			const noComments = msg.toStore();
			expect(storedPost).toEqual(noComments);
		});

		it('should send comment to ws and push to list', async () => {
			const guid = chance.guid();
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID(guid)
				.get();

			root.state.feed.items = [post];

			const comment = {
				guid,
				text: chance.sentence(),
			};

			await root.dispatch(`${FeedStore}/${FeedActions.sendComment}`, comment);

			const sendObjInvocationArg = $ws.sendObj.mock.calls[0][0];
			expect(sendObjInvocationArg).toMatchObject({
				type: 'addComment',
				...comment,
			});
			expect(post.comments).toEqual([ {
				author: {
					name: jasmine.any(String),
					avatar: jasmine.any(String),
				},
				ts: jasmine.any(Number),
				text: comment.text,
			} ]);
		});
	});
});
