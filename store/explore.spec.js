import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { ExploreStore, ExploreActions, mutations, STORAGE_TOPOUTFITS_KEY } from './explore';
import store from './index';
import { Storage } from '~/test/storage.mock';

describe('Explore store module', () => {
	describe('mutations', () => {
		const { setTopOutfits } = mutations;

		let state;

		beforeEach(() => {
			state = {
				topOutfits: {
					ts: null,
					items: null,
				},
			};
		});

		it('should set topOutfits', () => {
			global.sessionStorage = new Storage();
			const items = new Array(20).fill({
				post: {
					type: 'outfitPost',
				},
			});
			const ts = Date.now();
			setTopOutfits(state, { items, ts });
			const length = JSON.parse(sessionStorage.getItem(STORAGE_TOPOUTFITS_KEY)).items.length;
			expect(state.topOutfits).toStrictEqual({ items, ts });
			expect(length).toBe(20);
		});
	});

	describe('actions', () => {
		let root;
		let $ws;

		const aDummyMerchantId = 'aDummyMerchantId';

		beforeEach(() => {
			const localVue = createLocalVue();
			localVue.use(Vuex);
			$ws = { sendObj: jest.fn() };
			root = new Vuex.Store(store);
			root.state.socket.isConnected = true;
			root.state.merchant.id = aDummyMerchantId;
			root.state.socket.$ws = $ws;
			root.state.commit = jest.fn();
			global.sessionStorage = new Storage();
		});

		it('should send fetchTopOutfits', async () => {
			sessionStorage.removeItem(STORAGE_TOPOUTFITS_KEY);
			await root.dispatch(`${ExploreStore}/${ExploreActions.fetchTopOutfits}`);
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
				type: 'fetchTopOutfits',
			});
		});

		it('should not fetch from backend if items were saved in session within 5 minute', async () => {
			const items = new Array(20).fill({
				post: {
					type: 'outfitPost',
				},
			});
			const ts = Date.now();
			sessionStorage.setItem(STORAGE_TOPOUTFITS_KEY, JSON.stringify({ items, ts }));
			await root.dispatch(`${ExploreStore}/${ExploreActions.fetchTopOutfits}`);
			expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
		});
	});
});
