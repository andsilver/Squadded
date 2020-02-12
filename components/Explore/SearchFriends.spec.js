import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SearchFriends from './SearchFriends.vue';
import Store from '~/store';
import { ExploreStore, ExploreActions, ExploreMutations } from '~/store/explore';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('SearchFriends in Explore', () => {
	let wrapper;
	let store;
	let localVue;

	const SEARCH_TEXT = 'search-text';
	const CLOSE_BTN = 'close-btn';
	const $emit = jest.fn();

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.dispatch = jest.fn();
		wrapper = shallowMount(SearchFriends, {
			localVue,
			store,
			mocks: {
				$t: msg => msg,
				$emit,
			},
		});
	});

	it('should render correct content', () => {
		expect(wrapper.ref(SEARCH_TEXT).exists()).toBe(true);
	});

	it('should dispatch after 1s of debounce time', () => {
		jest.useFakeTimers();
		wrapper.setData({ searchText: 'abc', isTyping: true });
		expect($emit).toHaveBeenCalledWith('change', wrapper.vm.searchText);
		jest.advanceTimersByTime(1500);
		expect(store.dispatch).toHaveBeenCalledWith(`${ExploreStore}/${ExploreActions.searchFriends}`, 'abc');
	});

	it('should not dispatch within 1s of debounce time', () => {
		jest.useFakeTimers();
		wrapper.setData({ searchText: 'abc', isTyping: true });
		jest.advanceTimersByTime(500);
		expect(store.dispatch).not.toHaveBeenCalled();
	});

	it('should show close button on focus and hide on click', async () => {
		await wrapper.ref(SEARCH_TEXT).trigger('focus');
		expect(wrapper.ref(CLOSE_BTN).exists()).toBe(true);
		store.commit = jest.fn();
		await wrapper.ref(SEARCH_TEXT).trigger('focus');
		expect(store.commit).toHaveBeenCalledWith(`${ExploreStore}/${ExploreMutations.setSearching}`, true);
		await wrapper.ref(CLOSE_BTN).trigger('click');
		expect(store.commit).toHaveBeenCalledWith(`${ExploreStore}/${ExploreMutations.setSearching}`, false);
	});
});
