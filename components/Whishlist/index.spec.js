import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Whishlist from './index.vue';
import { flushPromises } from '~/helpers';
import Store from '~/store';
import { ActivityStore, ActivityMutations } from '~/store/activity';

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
	let wrapper;

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
		wrapper = shallowMount(Whishlist, {
			localVue,
			store,
			mocks,
		});
	});

	it('sets the correct default props', async () => {
		expect(wrapper.vm.wishlist).toBe(null);

		store.commit('SET_SOCKET_AUTH', true);
		await flushPromises();

		expect(store.state.socket.$ws.sendObj).toHaveBeenCalledWith({
			type: 'fetchWishlist',
		});
	});

	it('should render preloader', () => {
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});

	it('renders the correct message for empty Whishlist', () => {
		expect.assertions(2);

		store.state.activity.wishlist = [];

		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('feed.isEmpty');
	});

	it('should clear prev data from whishlist', () => {
		store.commit = jest.fn();

		shallowMount(Whishlist, {
			localVue,
			store,
			mocks,
		});

		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.clearWishlist}`);
	});
});
