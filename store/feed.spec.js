import { Chance } from 'chance';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import feed, { FeedStore, FeedActions, FeedMutations, mutations } from './feed';
import store from './index';
import { storePostReportInSession } from '~/utils/reportSession';
import { Storage } from '~/test/storage.mock';

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
			markAllLoaded,
		} = mutations;

		let state;

		beforeEach(() => {
			state = {
				items: [],
				allLoaded: false,
				loadedNew: false,
			};
		});

		it('should set all items in store', () => {
			const length = Math.floor(Math.random() * 100 + 1);
			const newItems = new Array(length).fill(aDefaultSingleItemMsgBuilder().get());

			setItems(state, newItems);
			expect(state.items).toStrictEqual(newItems);
			expect(state.items.length).toBe(length);
		});

		it('addItem should push any item to existing list', () => {
			const newItem = aDefaultSingleItemMsgBuilder().get();

			addItem(state, newItem);
			expect(state.items.length).toBe(1);
			expect(state.items[0]).toBe(newItem);
		});

		it('should not add reported item', () => {
			const length = Math.floor(Math.random() * 100 + 1);
			const newItems = new Array(length).fill(aDefaultSingleItemMsgBuilder().withGUID().get());
			const reportedItem = newItems[0];
			global.sessionStorage = new Storage();
			storePostReportInSession(reportedItem);
			setItems(state, newItems);
			expect(state.items).not.toContain(reportedItem);
		});

		it('should mark allLoaded as true', () => {
			const newItems = [];
			markAllLoaded(state, newItems);
			expect(state.allLoaded).toBe(true);
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
				from: latestItem.ts,
			});
		});

		it('should add any item', async () => {
			function item() {
				return aDefaultSingleItemMsgBuilder()
					.withGUID()
					.get();
			}

			await feedStore.commit(`${FeedMutations.addItem}`, item());
			await feedStore.commit(`${FeedMutations.addItem}`, item());
			await feedStore.commit(`${FeedMutations.addItem}`, item());
			await feedStore.commit(`${FeedMutations.addItem}`, item());

			expect(feedStore.state.items.length).toBe(4);
		});

		it('should not send fetchPosts message if allLoaded', () => {
			root.state.feed.allLoaded = true;
			root.dispatch(`${FeedStore}/${FeedActions.fetch}`);
			expect($ws.sendObj).not.toHaveBeenCalled();
		});
	});
});
