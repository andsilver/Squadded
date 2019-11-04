import { Chance } from 'chance';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import feed, { FeedStore, FeedActions, mutations } from './feed';
import store from './index';
import { userMockBuilder } from '~/test/user.mock';

const chance = new Chance();
const localVue = createLocalVue();
localVue.use(Vuex);

let spy = null;

describe('Feed store module', () => {
	afterEach(() => {
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
	});

	describe('actions', () => {
		let root;
		let feedStore;
		let $ws;

		const aDummyMerchantId = 'aDummyMerchantId';

		beforeEach(() => {
			$ws = { sendObj: jest.fn() };
			feedStore = new Vuex.Store(feed);
			root = new Vuex.Store(store);
			root.state.socket.isConnected = true;
			root.state.merchant.id = aDummyMerchantId;
			root.state.socket.$ws = $ws;
		});

		it('should fetch posts later than storred', () => {
			const latestItem = { ts: new Date(chance.date()).getTime() };
			root.state.feed.items = [latestItem];

			root.dispatch(`${FeedStore}/${FeedActions.fetch}`);

			expect($ws.sendObj).toHaveBeenCalledWith({
				type: 'fetchPosts',
				ts: latestItem.ts,
			});
		});

		it('should commit addItem on saveItem', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();
			const me = userMockBuilder();
			root.state.user.me = me;

			msg.correlationId = jasmine.any(String);
			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
			expect(root.state.feed.items).toEqual([ { ...msg, user: me.short() } ]);
		});

		it('should commit addItem when receive new item', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			await feedStore.dispatch(`${FeedActions.receiveItem}`, msg);
			expect(feedStore.state.items).toEqual([ msg ]);
		});

		it('should strip error, ts, user, comments, likes and merchantId when sending singleItemPost to socket', async () => {
			const msg = aDefaultSingleItemMsgBuilder().get();

			root.state.socket.isAuth = true;
			await root.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);

			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledTimes(1);
			const { comments, error, likes, merchantId, ts, user, ...clean } = msg;
			clean.correlationId = jasmine.any(String);
			const sendObjInvocationArg = $ws.sendObj.mock.calls[0][0];
			expect(sendObjInvocationArg).toMatchObject(clean);
			expect(sendObjInvocationArg).not.toHaveProperty('ts');
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

		it('should add any item', async () => {
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
		});
	});
});
