import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import All from './all.vue';
import Store from '~/store';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { Storage } from '~/test/storage.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('All', () => {
	const EMPTY_FEED_TEXT = 'empty-feed-text';
	const MAIN = 'main';
	const TOP_BAR = 'top-bar';
	const PRELOADER = 'preloader';

	let localVue;
	let store;
	let wrapper;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		global.localStorage = new Storage();
		localStorage.clear();

		store = new Vuex.Store(Store);

		wrapper = shallowMount(All, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should display StartWatchingDialog on first visit', () => {
		expect(wrapper.vm.showStartWatchingDialog).toBe(true);
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
		store.state.activity.community = [];
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('feed.isEmpty');
	});

	it('should display a preloader while community is null', () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.activity.community = null;
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});

	it('should call fetchItems', async () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.dispatch = jest.fn();
		await wrapper.vm.init();
		expect(store.dispatch).toHaveBeenCalledWith(`${ActivityStore}/${ActivityActions.fetchItems}`, {
			type: 'community',
			loadNew: true,
		});
	});

	it('should set loadNew button after timeout', async () => {
		jest.useFakeTimers();
		store.commit('SET_SOCKET_AUTH', true);
		await wrapper.vm.init();
		jest.advanceTimersByTime(60 * 1000);
		expect(wrapper.vm.loadNew).toBe(true);
	});
});
