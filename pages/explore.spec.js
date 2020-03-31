import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Explore from './explore.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import { ExploreStore, ExploreMutations } from '~/store/explore';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Explore page', () => {
	const TOP_OUTFITS = 'top-outfits';
	const ENDING_POLLS = 'ending-polls';
	const TOP_ITEMS = 'top-items';
	const TOP_GALLERY = 'top-gallery';
	const SEARCH_FIELD = 'search-field';
	const USER_LIST = 'user-list';
	const NO_RESULT = 'no-result';

	let wrapper;
	let store;
	let localVue;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		wrapper = shallowMount(Explore, {
			localVue,
			store,
		});
	});

	it('should render correct contents', () => {
		expect(wrapper.ref(TOP_OUTFITS).exists()).toBe(true);
		expect(wrapper.ref(ENDING_POLLS).exists()).toBe(true);
		expect(wrapper.ref(TOP_ITEMS).exists()).toBe(true);
		expect(wrapper.ref(TOP_GALLERY).exists()).toBe(true);
		expect(wrapper.ref(SEARCH_FIELD).exists()).toBe(true);
		expect(wrapper.ref(USER_LIST).exists()).toBe(false);
		expect(wrapper.ref(NO_RESULT).exists()).toBe(false);
	});

	it('should render user list when friends are available but not render other sections', async () => {
		const friends = new Array(3).fill(userMockBuilder().short());
		await store.commit(`${ExploreStore}/${ExploreMutations.setFriends}`, friends);
		await store.commit(`${ExploreStore}/${ExploreMutations.setSearching}`, true);
		wrapper.setData({ searchText: 'abc' });
		expect(wrapper.ref(NO_RESULT).exists()).toBe(false);
		expect(wrapper.ref(USER_LIST).exists()).toBe(true);
	});

	it('should set searching false on destroy', () => {
		store.commit = jest.fn();
		wrapper.destroy();
		expect(store.commit).toHaveBeenCalledWith(`${ExploreStore}/${ExploreMutations.setSearching}`, false);
	});
});
