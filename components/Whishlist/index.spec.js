import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Whishlist from './index.vue';
import Store from '~/store';
import { UserStore, UserMutations } from '~/store/user';

// import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

function flushPromises() {
	return new Promise(resolve => setImmediate(resolve));
}

describe('Whishlist Component', () => {
	const EMPTY_FEED_TEXT = 'empty-whishlist-text';
	const PRELOADER = 'preloader';
	let query;
	let mocks;

	let localVue;
	let store;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
		store.commit('jSocket', {
			sendObj: jest.fn(),
		});
	}

	beforeEach(() => {
		initLocalVue();
		query = {};
		mocks = {
			$t: msg => msg,
			$route: {
				query,
			},
		};
	});
	/* const propsData = {
		items: [aDefaultSingleItemMsgBuilder().get()],
	}; */

	it('sets the correct default props', () => {
		const wrapper = shallowMount(Whishlist, {
			localVue,
			store,
			mocks,
		});
		expect(wrapper.vm.posts).toBe(null);

		expect(store.state.socket.$ws.sendObj).toHaveBeenCalledWith({
			type: 'fetchWishlist',
		});
	});

	it('should render preloader', () => {
		const wrapper = shallowMount(Whishlist, {
			localVue,
			store,
			mocks,
		});
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});

	it('renders the correct message for empty Whishlist', async () => {
		expect.assertions(2);

		const wrapper = shallowMount(Whishlist, {
			localVue,
			store,
			mocks,
		});

		store.state.user.other = {};
		store.commit(`${UserStore}/${UserMutations.setWishlist}`, {
			wishlist: [],
		});

		await flushPromises();

		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('feed.isEmpty');
	});
});
