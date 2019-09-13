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
		} = mutations;

		afterEach(() => {
			sessionStorage.clear();
		});

		it('should set all items in store', () => {
			const state = {
				items: [],
			};

			const length = Math.floor(Math.random() * 100 + 1);
			const newItems = Array(length);

			setItems(state, newItems);
			expect(state.items).toBe(newItems);
			expect(state.items.length).toBe(length);
		});

		it('addItem should push any item to existing list', () => {
			const state = {
				items: [],
			};
			const newItem = aDefaultSingleItemMsgBuilder().get();

			addItem(state, newItem);
			expect(state.items.length).toBe(1);
			expect(state.items[0]).toBe(newItem);
		});

		it('should update item guid and ts on load', () => {
			const pendingItem = aDefaultSingleItemMsgBuilder()
				.withCorrelationId(chance.guid())
				.get();

			const state = {
				items: [pendingItem],
			};

			const loadedItem = Object.assign({}, pendingItem, { guid: chance.guid(), ts: Date.now() });
			itemLoaded(state, loadedItem);
			expect(state.items.length).toBe(1);
			expect(pendingItem.guid).toBe(loadedItem.guid);
			expect(pendingItem.ts).toBe(loadedItem.ts);
		});

		it('should restore from sessionStore on reload', () => {
			const state = {
				items: [],
			};
			const storred = aDefaultSingleItemMsgBuilder().get();
			sessionStorage.setItem(FeedStore, JSON.stringify(storred));

			restoreSession(state);
			expect(state.items[0]).toEqual(storred);
		});

		it('should not restore from sessionStore on jump', () => {
			const current = aDefaultSingleItemMsgBuilder().get();
			const state = {
				items: [current],
			};

			const storred = aDefaultSingleItemMsgBuilder().get();
			sessionStorage.setItem(FeedStore, JSON.stringify(storred));

			spyOn(Storage.prototype, 'getItem');

			restoreSession(state);
			expect(sessionStorage.getItem).toHaveBeenCalledTimes(0);
			expect(state.items[0]).toEqual(current);
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

		it('should commit addItem on saveItem', async (done) => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			const saved = Object.assign({}, msg, {
				likes: {},
				correlationId: jasmine.any(String),
				ts: Number.MAX_SAFE_INTEGER,
			});
			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.feed.items).toEqual([ saved ]);

			done();
		});

		it('should commit addItem when receive new item', async (done) => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			await feedStore.dispatch(`${FeedActions.receiveItem}`, msg);
			expect(feedStore.state.items).toEqual([ msg ]);

			done();
		});

		it('should send item to socket with no merchantId when saveItem', async (done) => {
			spyOn(root.state.socket.$ws, 'sendObj');

			const msg = aDefaultSingleItemMsgBuilder().get();

			root.state.socket.isAuth = true;
			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);

			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledTimes(1);
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith(msg);
			done();
		});

		it('should not send item on save while WS disconnected', async (done) => {
			root.state.socket.isConnected = false;
			spyOn(root.state.socket.$ws, 'sendObj');

			const msg = aDefaultSingleItemMsgBuilder().get();

			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledTimes(0);

			done();
		});

		it('should not send item on save while WS not auth', async (done) => {
			spyOn(root.state.socket.$ws, 'sendObj');

			const msg = aDefaultSingleItemMsgBuilder().get();

			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledTimes(0);

			done();
		});

		it('should update pending item', async (done) => {
			const pendingItem = aDefaultSingleItemMsgBuilder()
				.withCorrelationId(chance.guid())
				.get();

			feedStore.state.items = [pendingItem];

			const loadedItem = Object.assign({}, pendingItem, { guid: chance.guid(), ts: Date.now() });
			await feedStore.dispatch(`${FeedActions.receiveItem}`, loadedItem);

			expect(pendingItem).not.toHaveProperty('correlationId');
			expect(pendingItem.guid).toBe(loadedItem.guid);
			expect(pendingItem.ts).toBe(loadedItem.ts);

			done();
		});

		it('should not add pending item when store', async (done) => {
			const msg = aDefaultSingleItemMsgBuilder().get();
			const length = sessionStorage.length;

			await feedStore.dispatch(`${FeedActions.storeItem}`, msg);

			expect(feedStore.state.items).toEqual([ msg ]);
			expect(sessionStorage.length).toBe(length);

			done();
		});

		it('should add only acknowledged item when store', async (done) => {
			const msg = aDefaultSingleItemMsgBuilder().withGUID().get();
			const length = sessionStorage.length;

			await feedStore.dispatch(`${FeedActions.storeItem}`, msg);

			expect(feedStore.state.items).toEqual([ msg ]);
			expect(sessionStorage.length).toBe(length + 1);

			done();
		});

		it('should add any item and keep limit', async (done) => {
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

			done();
		});
	});
});
