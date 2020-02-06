import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Feed from './feed.vue';
import Store from '~/store';
import { FeedMutations, FeedStore } from '~/store/feed';
import { prefetch, onAuth } from '~/helpers';
import { userMockBuilder } from '~/test/user.mock';

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
	let me = userMockBuilder().get();
	const $router = {
		push: jest.fn(),
	};

	const initLocalVue = () => {
		onAuth.mockClear();
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.state.user.me = me;
		wrapper = shallowMount(Feed, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	};

	beforeEach(() => {
		initLocalVue();
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

	it('should go to \'create your squad\' page when squaddersCount is 0 and nameSelected', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		me = { isMe: true, squaddersCount: 0, nameSelected: true };
		initLocalVue();
		expect($router.push).toHaveBeenCalledWith('/create-your-squad');
	});

	it('should fetch squadders and first user in squadder should be me', async () => {
		prefetch.mockReturnValue(Promise.resolve([{ isMe: false }]));
		await store.commit('SET_SOCKET_AUTH', true);
		me = { isMe: true, squaddersCount: 2, nameSelected: true };
		initLocalVue();
		expect(prefetch).toHaveBeenCalledWith({
			type: 'fetchSquadders',
			store,
			mutation: `${FeedStore}/${FeedMutations.receiveSquadders}`,
		});
		await Promise.resolve();
		expect(wrapper.vm.squadders[0].isMe).toBe(true);
	});

	it('should go to \'create your squad\' page when no one in squad', async () => {
		prefetch.mockReturnValue(Promise.resolve([]));
		await store.commit('SET_SOCKET_AUTH', true);
		await Promise.resolve();
		expect($router.push).toHaveBeenCalledWith('/create-your-squad');
	});
});
