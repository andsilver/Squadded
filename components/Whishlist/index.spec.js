import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Whishlist from './index.vue';
import Store from '~/store';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Whishlist Component', () => {
	const EMPTY_FEED_TEXT = 'empty-whishlist-text';
	const PRELOADER = 'preloader';
	let params;
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
		params = {};
		mocks = {
			$t: msg => msg,
			$route: {
				params,
			},
		};
	});

	it('sets the correct default props', () => {
		const wrapper = shallowMount(Whishlist, {
			localVue,
			store,
			mocks,
		});
		expect(wrapper.vm.wishlist).toBe(null);

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

	it('renders the correct message for empty Whishlist', () => {
		expect.assertions(2);

		store.state.activity.wishlist = [];

		const wrapper = shallowMount(Whishlist, {
			localVue,
			store,
			mocks,
		});

		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('feed.isEmpty');
	});
});
