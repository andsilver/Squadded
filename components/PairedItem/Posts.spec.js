import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Posts from './Posts.vue';
import Store from '~/store';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Paired Item Posts', () => {
	let wrapper;
	let store;
	let localVue;

	const ALL_TAB = 'all-tab';
	const OUTFITS_TAB = 'outfits-tab';
	const POLLS_TAB = 'polls-tab';
	const PHOTOS_TAB = 'photos-tab';

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		wrapper = shallowMount(Posts, {
			store,
			localVue,
		});
	});

	it('should display content', () => {
		const allTab = wrapper.ref(ALL_TAB);
		const outfitsTab = wrapper.ref(OUTFITS_TAB);
		const pollsTab = wrapper.ref(POLLS_TAB);
		const photosTab = wrapper.ref(PHOTOS_TAB);

		expect(allTab.exists()).toBe(true);
		expect(outfitsTab.exists()).toBe(true);
		expect(pollsTab.exists()).toBe(true);
		expect(photosTab.exists()).toBe(true);
	});
});
