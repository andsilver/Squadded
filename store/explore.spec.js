import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { ExploreStore, ExploreActions, mutations, STORAGE_KEYS } from './explore';
import store from './index';
import { Storage } from '~/test/storage.mock';
import { userMockBuilder } from '~/test/user.mock';

describe('Explore store module', () => {
	const type = 'topOutfits';

	describe('mutations', () => {
		const { setItems, setFriends } = mutations;

		let state;

		beforeEach(() => {
			state = {
				topOutfits: {
					ts: null,
					items: null,
				},
				topGallery: {
					ts: null,
					items: null,
				},
			};
		});

		it(`should set ${type}`, () => {
			global.sessionStorage = new Storage();
			const items = new Array(20).fill({
				post: {
					type: 'outfitPost',
				},
			});
			const ts = Date.now();
			setItems(state, {
				content: { items, ts },
				type,
			});
			const length = JSON.parse(sessionStorage.getItem(STORAGE_KEYS[type])).items.length;
			expect(state[type]).toStrictEqual({ items, ts });
			expect(length).toBe(20);
		});

		it('should set friends', () => {
			const friends = new Array(3).fill(userMockBuilder().short());
			setFriends(state, friends);
			expect(state.friends).toStrictEqual(friends);
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

		it(`should send msg to fetch ${type}`, async () => {
			sessionStorage.clear();
			await root.dispatch(`${ExploreStore}/${ExploreActions.fetchItems}`, type);
			const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
				type: `fetch${capitalized}`,
			});
		});

		it('should not fetch from backend if items were saved in session within 5 minute', async () => {
			const items = new Array(20).fill({
				post: {
					type,
				},
			});
			const ts = Date.now();
			sessionStorage.setItem(STORAGE_KEYS[type], JSON.stringify({ items, ts }));
			await root.dispatch(`${ExploreStore}/${ExploreActions.fetchItems}`, type);
			expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
		});

		it('should set friends as null and not send send msg if search text is empty', async () => {
			await root.dispatch(`${ExploreStore}/${ExploreActions.searchFriends}`, '');
			expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
			expect(root.state.explore.friends).toBe(null);
		});

		it('should not send msg if search text\'s leng is less than 3', async () => {
			await root.dispatch(`${ExploreStore}/${ExploreActions.searchFriends}`, '12');
			expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
		});

		it('should send searchUsers msg', async () => {
			const text = 'abc';
			await root.dispatch(`${ExploreStore}/${ExploreActions.searchFriends}`, 'abc');
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
				type: 'searchUsers',
				text,
			});
		});
	});
});
