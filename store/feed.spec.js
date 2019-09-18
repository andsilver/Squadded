import { Chance } from 'chance';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import feed, { FeedStore, FeedActions, mutations } from './feed';
import { state } from './index';

const chance = new Chance();
const localVue = createLocalVue();
localVue.use(Vuex);

describe('Feed store module', () => {
	describe('mutations', () => {
		const {
			setItems,
			addItem,
			itemLoaded,
			restoreSession,
			setPostLike,
		} = mutations;

		let state;

		beforeEach(() => {
			state = {
				items: [],
			};
		});

		afterEach(() => {
			sessionStorage.clear();
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
			const storred = aDefaultSingleItemMsgBuilder().get();
			sessionStorage.setItem(FeedStore, JSON.stringify(storred));

			restoreSession(state);
			expect(state.items[0]).toEqual(storred);
		});

		it('should not restore from sessionStore on jump', () => {
			const current = aDefaultSingleItemMsgBuilder().get();
			state.items = [current];

			const storred = aDefaultSingleItemMsgBuilder().get();
			sessionStorage.setItem(FeedStore, JSON.stringify(storred));

			spyOn(Storage.prototype, 'getItem');

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
	});

	describe('actions', () => {
		let root;
		let feedStore;

		const aDummyMerchantId = 'aDummyMerchantId';

		beforeEach(() => {
			feedStore = new Vuex.Store(feed);
			root = new Vuex.Store({
				state,
				modules: {
					feed,
				},
			});
			root.state.socket.isConnected = true;
			root.state.merchant.id = aDummyMerchantId;
			root.state.socket.$ws = { sendObj: function () {} };
		});

		afterEach(() => {
			sessionStorage.clear();
		});

		it('should commit addItem on saveItem', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			const saved = Object.assign({}, msg, {
				likes: {},
				correlationId: jasmine.any(String),
				ts: Number.MAX_SAFE_INTEGER,
			});
			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.feed.items).toEqual([ saved ]);
		});

		it('should commit addItem when receive new item', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			await feedStore.dispatch(`${FeedActions.receiveItem}`, msg);
			expect(feedStore.state.items).toEqual([ msg ]);
		});

		it('should send item to socket with no merchantId when saveItem', async () => {
			spyOn(root.state.socket.$ws, 'sendObj');

			const msg = aDefaultSingleItemMsgBuilder().get();

			root.state.socket.isAuth = true;
			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);

			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledTimes(1);
			const { merchantId, guid, ...clean } = msg;
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith(clean);
		});

		it('should toggle like state of post, send message, store', async () => {
			spyOn(root.state.socket.$ws, 'sendObj');

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
			expect(post).toEqual(JSON.parse(storedPost));
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
			spyOn(root.state.socket.$ws, 'sendObj');

			const msg = aDefaultSingleItemMsgBuilder().get();

			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledTimes(0);
		});

		it('should not send item on save while WS not auth', async () => {
			spyOn(root.state.socket.$ws, 'sendObj');

			const msg = aDefaultSingleItemMsgBuilder().get();

			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledTimes(0);
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
	});
});
