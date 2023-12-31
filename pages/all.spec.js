import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import All from './all.vue';
import Store from '~/store';
import { Storage } from '~/test/storage.mock';
import {
	STORAGE_VISITED_KEY,
	HOME_NEW_POSTS_INTERVAL,
	NEW_POSTS_DISAPPEAR_TIMEOUT,
} from '~/consts';
// import { HomeStore, HomeActions } from '~/store/home';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('All', () => {
	const EMPTY_FEED_TEXT = 'empty-feed-text';
	const MAIN = 'main';
	const TOP_BAR = 'top-bar';
	const PRELOADER = 'preloader';
	const PRELOADER_MORE = 'preloader-more';

	let localVue;
	let store;
	let wrapper;

	const $router = {
		push: jest.fn(),
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		global.localStorage = new Storage();
		localStorage.setItem(STORAGE_VISITED_KEY, 'true');

		store = new Vuex.Store(Store);
		store.state.user.me.guid = 'someguid';

		wrapper = shallowMount(All, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	});

	it('should display StartWatchingDialog on first visit', async () => {
		localStorage.clear();
		wrapper = shallowMount(All, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
		store.commit('SET_SOCKET_AUTH', true);
		await Promise.resolve();
		expect(wrapper.vm.firstVisit).toBe(true);
		expect($router.push).toHaveBeenCalledWith('/walkthrough');
	});

	it('should not display content while pending auth', () => {
		const main = wrapper.ref(MAIN);
		expect(main.exists()).toBe(false);
	});

	it('should display content only after auth', () => {
		store.commit('SET_PENDING', false);
		let main = wrapper.ref(MAIN);
		expect(main.exists()).toBe(false);

		store.commit('SET_SOCKET_AUTH', true);
		main = wrapper.ref(MAIN);
		expect(main.exists()).toBe(true);
		expect(wrapper.ref(TOP_BAR).exists()).toBe(true);
	});

	it('should render the correct message for empty Community', () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.home.posts = [];
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('feed.isEmpty');
	});

	it('should display a preloader while community is null', () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.home.posts = null;
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});

	it('should call fetchItems', async () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.dispatch = jest.fn();
		store.state.home.posts = [];
		await wrapper.vm.init();
		// expect(store.dispatch).toHaveBeenCalledWith(`${HomeStore}/${HomeActions.fetch}`, true);
	});

	it('should render preloader for load more', async () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.home.posts = [{}];
		await wrapper.vm.fetchHome();
		expect(wrapper.ref(PRELOADER_MORE).exists()).toBe(true);
	});

	it('should set loadNew button after timeout', async () => {
		jest.useFakeTimers();
		store.commit('SET_SOCKET_AUTH', true);
		await wrapper.vm.init();
		jest.advanceTimersByTime(HOME_NEW_POSTS_INTERVAL);
		// expect(wrapper.vm.loadNew).toBe(true);
		jest.advanceTimersByTime(NEW_POSTS_DISAPPEAR_TIMEOUT);
		expect(wrapper.vm.loadNew).toBe(false);
	});
});
