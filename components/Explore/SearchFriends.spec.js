import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SearchFriends from './SearchFriends.vue';
import Store from '~/store';
import { ExploreStore, ExploreActions } from '~/store/explore';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('SearchFriends in Explore', () => {
	let wrapper;
	let store;
	let localVue;

	const SEARCH_TEXT = 'search-text';

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
			},
		});
	});

	it('should render correct content', () => {
		expect(wrapper.ref(SEARCH_TEXT).exists()).toBe(true);
	});

	it('should dispatch after 1s of debounce time', () => {
		jest.useFakeTimers();
		wrapper.setData({ searchText: 'abc', isTyping: true });
		jest.advanceTimersByTime(1500);
		expect(store.dispatch).toHaveBeenCalledWith(`${ExploreStore}/${ExploreActions.searchFriends}`, 'abc');
	});

	it('should not dispatch within 1s of debounce time', () => {
		jest.useFakeTimers();
		wrapper.setData({ searchText: 'abc', isTyping: true });
		jest.advanceTimersByTime(500);
		expect(store.dispatch).not.toHaveBeenCalled();
	});
});
