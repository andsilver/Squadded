import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PairedItemPage from './_id.vue';
import { PairedItemStore, PairedItemActions, PairedItemMutations } from '~/store/paired-item';
import Store from '~/store';
import { itemBuilder } from '~/test/item.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Paired Item', () => {
	const TOPBAR = 'topbar';
	const ITEM_DETAILS = 'item-details';
	const HESITATING_USERS = 'hesitating-users';
	const POSTS = 'posts';

	let $router;
	let localVue;
	let store;
	let wrapper;
	let $route = {
		query: {
			varId: 'any',
			itemId: 'any',
			postId: 'any',
		},
	};

	const initWrapper = () => {
		wrapper = shallowMount(PairedItemPage, {
			store,
			localVue,
			mocks: {
				$router,
				$route,
			},
		});
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		$router = {
			push: jest.fn(),
			back: jest.fn(),
		};
		store = new Vuex.Store(Store);
		store.dispatch = jest.fn();
		initWrapper();
	});

	it('should dispatch initPairedItem action on init', () => {
		const { varId, itemId, postId } = $route.query;
		expect(store.dispatch).toHaveBeenCalledWith(`${PairedItemStore}/${PairedItemActions.initPairedItem}`, {
			varId,
			itemId,
			postId,
		});
	});

	it('should display content if item is exist', () => {
		const item = itemBuilder().get();
		store.commit(`${PairedItemStore}/${PairedItemMutations.setItem}`, item);
		const topbar = wrapper.ref(TOPBAR);
		const itemDetails = wrapper.ref(ITEM_DETAILS);
		const hesitatingUsers = wrapper.ref(HESITATING_USERS);
		const posts = wrapper.ref(POSTS);
		expect(topbar.exists()).toBeTruthy();
		expect(itemDetails.exists()).toBeTruthy();
		expect(hesitatingUsers.exists()).toBeTruthy();
		expect(posts.exists()).toBeTruthy();
	});

	it('should not display content if item is not exist', () => {
		store.commit(`${PairedItemStore}/${PairedItemMutations.setItem}`, null);
		const topbar = wrapper.ref(TOPBAR);
		const itemDetails = wrapper.ref(ITEM_DETAILS);
		const hesitatingUsers = wrapper.ref(HESITATING_USERS);
		const posts = wrapper.ref(POSTS);
		expect(topbar.exists()).toBeFalsy();
		expect(itemDetails.exists()).toBeFalsy();
		expect(hesitatingUsers.exists()).toBeFalsy();
		expect(posts.exists()).toBeFalsy();
	});

	it('should navigate back if itemId or postId is not passed in url', () => {
		$route = {
			query: {
				itemId: null,
				postId: null,
			},
		};
		initWrapper();
		expect($router.back).toHaveBeenCalled();
	});
});
