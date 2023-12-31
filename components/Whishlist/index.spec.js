import { Chance } from 'chance';
import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Whishlist from './index.vue';
import Store from '~/store';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { USER_TOKEN_KEY } from '~/consts/keys';

const chance = new Chance();

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
	let ws;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		ws = {
			sendObj: jest.fn(),
		};
		store = new Vuex.Store(Store);
		store.commit('jSocket', ws);
	}

	beforeEach(() => {
		initLocalVue();
		params = {
			id: chance.guid(),
		};
		mocks = {
			$t: msg => msg,
			$route: {
				params,
			},
		};
		document.body.addEventListener = jest.fn();
		document.body.scrollTo = jest.fn();
		document.body.removeEventListener = jest.fn();
		localStorage.setItem(USER_TOKEN_KEY, 'token');
		wrapper = shallowMount(Whishlist, {
			localVue,
			store,
			mocks,
		});
	});

	it('should render preloader', () => {
		store.commit('SET_SOCKET_AUTH', true);
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});

	it('renders the correct message for empty Whishlist', () => {
		expect.assertions(2);
		store.state.activity.wishlist = [];
		store.commit('SET_SOCKET_AUTH', false);

		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('wishlist.disabled_before_signin');
	});

	it('should fetch items', async () => {
		store.dispatch = jest.fn();
		store.commit('SET_SOCKET_AUTH', true);

		shallowMount(Whishlist, {
			localVue,
			store,
			mocks,
		});
		await Promise.resolve();

		expect(store.dispatch).toHaveBeenCalledWith(`${ActivityStore}/${ActivityActions.fetchItems}`, { type: 'wishlist', guid: params.id });
	});

	it('should add listener for scroll on mounted', () => {
		expect(document.body.addEventListener).toHaveBeenCalledWith('scroll', wrapper.vm.onScroll);
	});

	it('should remove listener for scroll on destroyed', () => {
		wrapper.destroy();
		expect(document.body.removeEventListener).toHaveBeenCalledWith('scroll', wrapper.vm.onScroll);
	});

	it('should emit loadMore event on scroll bottom', () => {
		Math.max = jest.fn();
		Math.max.mockReturnValue(0);
		document.body.scrollTop = 1000;
		wrapper.vm.$emit = jest.fn();
		wrapper.vm.fetchWishlist = jest.fn();
		wrapper.vm.onScroll();
		expect(wrapper.vm.fetchWishlist).toHaveBeenCalled();
	});
});
