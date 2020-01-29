import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Feed from './feed.vue';
import Store from '~/store';
import { FeedMutations, FeedStore } from '~/store/feed';
import { prefetch, onAuth } from '~/helpers';

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
	onAuth: jest.fn(),
}));

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Feed Page', () => {
	const EMPTY_FEED_TEXT = 'empty-feed-text';
	const MAIN = 'feed-layout';
	const TOP_BAR = 'top-bar';
	const PRELOADER = 'preloader';

	let localVue;
	let store;
	let wrapper;
	const $router = {
		push: jest.fn(),
	};

	beforeEach(() => {
		onAuth.mockClear();
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);

		wrapper = shallowMount(Feed, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	});

	it('should not display content while pending auth', () => {
		const feed = wrapper.ref(MAIN);
		expect(feed.exists()).toBe(false);
	});

	it('should display content only after auth', () => {
		store.commit('SET_PENDING', false);
		let feed = wrapper.ref(MAIN);
		expect(feed.exists()).toBe(false);

		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.loading = false;
		store.state.feed.items = [{}];
		feed = wrapper.ref(MAIN);
		expect(feed.exists()).toBe(true);
		expect(wrapper.ref(TOP_BAR).exists()).toBe(true);
	});

	it('should render the correct message for empty Feed', () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.loading = false;
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('feed.isEmpty');
	});

	it('should display a preloader while loading', () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.loading = true;
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});

	it('should set loading false after timeout', () => {
		jest.useFakeTimers();
		store.commit('SET_SOCKET_AUTH', true);
		store.dispatch = jest.fn();
		store.commit = jest.fn();
		wrapper.vm.fetchFeed();
		jest.advanceTimersByTime(4000);
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.setLoading}`, false);
	});

	it('loadNew should be true after 1 minute', () => {
		jest.useFakeTimers();
		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.loading = true;
		expect(wrapper.vm.loadNew).toBe(false);
		jest.advanceTimersByTime(60 * 1000);
		setTimeout(() => {
			expect(wrapper.vm.loadNew).toBe(true);
		});
	});

	it('should fetch squadders', async () => {
		prefetch.mockReturnValue(Promise.resolve([]));
		await store.commit('SET_SOCKET_AUTH', true);
		expect(prefetch).toHaveBeenCalledWith({
			type: 'fetchSquadders',
			store,
			mutation: `${FeedStore}/${FeedMutations.receiveSquadders}`,
		});
	});

	it('should go to \'create your squad\' page when no one in squad', async () => {
		prefetch.mockReturnValue(Promise.resolve([]));
		await store.commit('SET_SOCKET_AUTH', true);
		await Promise.resolve();
		expect($router.push).toHaveBeenCalledWith('/create-your-squad');
	});
});
