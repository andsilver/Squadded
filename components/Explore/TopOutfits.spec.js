import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import TopOutfits from './TopOutfits.vue';
import Store from '~/store';
import CardFrame from '~/components/Posts/Includes/CardFrame';
import { ExploreStore, ExploreMutations } from '~/store/explore';
import { outfitPostBuilder } from '~/test/outfit.post.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Top Outfits', () => {
	const OUTFITS_TITLE = 'outfits-title';
	const EMPTY_FEED_TEXT = 'empty-feed-text';

	let wrapper;
	let store;
	let localVue;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);

		wrapper = shallowMount(TopOutfits, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});
	});

	it('should render correct contents', () => {
		const outfitsTitle = wrapper.ref(OUTFITS_TITLE);
		const emptyFeedText = wrapper.ref(EMPTY_FEED_TEXT);
		expect(outfitsTitle.exists()).toBe(true);
		expect(emptyFeedText.exists()).toBe(true);

		const items = new Array(20).fill({ post: outfitPostBuilder().get() });
		store.commit(`${ExploreStore}/${ExploreMutations.setTopOutfits}`, { items, ts: Date.now() });
		const outfits = wrapper.findAll(CardFrame);
		expect(outfits.length).toBe(20);
	});
});
