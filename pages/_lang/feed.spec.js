import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Feed from './feed.vue';
import Store from '~/store';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Message Input', () => {
	const MAIN = 'feed-layout';

	let localVue;
	let store;
	let wrapper;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);

		wrapper = shallowMount(Feed, {
			store,
			localVue,
		});
	});

	it('should set pending false if already auth on mount', () => {
		store.commit('SET_SOCKET_AUTH', true);
		spyOn(store, 'commit');

		wrapper = shallowMount(Feed, {
			store,
			localVue,
		});
		expect(store.commit).toHaveBeenCalledWith('SET_PENDING', false);
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
		feed = wrapper.ref(MAIN);
		expect(feed.exists()).toBe(true);
	});
});
