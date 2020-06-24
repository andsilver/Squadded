import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Feed from './feed.vue';
import Store from '~/store';
import { prefetch, onAuth } from '~/helpers';
import { userMockBuilder } from '~/test/user.mock';
import { NEW_POSTS_DISAPPEAR_TIMEOUT } from '~/consts';

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
	onAuth: jest.fn(),
}));

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Feed Page', () => {
	const MAIN = 'feed-layout';
	// const TOP_BAR = 'top-bar';
	const PRELOADER = 'preloader';
	const PRELOADER_MORE = 'preloader-more';

	let localVue;
	let store;
	let wrapper;
	const me = userMockBuilder().get();
	me.isMe = true;
	const $router = {
		push: jest.fn(),
	};

	const initLocalVue = () => {
		onAuth.mockClear();
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.state.user.me = me;
		prefetch.mockReturnValue(Promise.resolve());
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
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runAllTimers();
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
		// expect(wrapper.ref(TOP_BAR).exists()).toBe(true);
	});

	it('should render a preloader if items not exist', () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.items = null;
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
	});

	it('should display a preloader while loading more', () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.loading = true;
		store.state.feed.items = [{}];
		expect(wrapper.ref(PRELOADER_MORE).exists()).toBe(true);
	});

	it('loadNew should be false after timeout of new posts available', (done) => {
		jest.useFakeTimers();
		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.loading = true;
		jest.advanceTimersByTime(NEW_POSTS_DISAPPEAR_TIMEOUT);
		expect(wrapper.vm.newPostsAvailable).toBe(false);
		done();
	});

	it('should fetch squadders and first user in squadder should be me', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		expect(prefetch).toHaveBeenCalledWith({
			type: 'fetchSquadders',
			store,
		});
		await Promise.resolve();
		expect(wrapper.vm.mysquad[0].isMe).toBe(true);
	});
});
