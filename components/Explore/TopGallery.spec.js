import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import TopGallery from './TopGallery.vue';
import Store from '~/store';
import { ExploreStore, ExploreMutations } from '~/store/explore';
import { galleryPostBuilder } from '~/test/gallery.post.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Top Gallery', () => {
	const TOP_GALLERY_TITLE = 'top-gallery-title';
	const EMPTY_FEED_TEXT = 'empty-feed-text';

	let wrapper;
	let store;
	let localVue;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);

		wrapper = shallowMount(TopGallery, {
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
		expect(wrapper.ref(TOP_GALLERY_TITLE).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);

		const items = new Array(20).fill(galleryPostBuilder().get());
		store.commit(`${ExploreStore}/${ExploreMutations.setItems}`, {
			type: 'topGallery',
			content: {
				items,
				ts: Date.now(),
			},
		});
		const galleryPosts = wrapper.findAll('.post-card');
		expect(galleryPosts.length).toBe(20);
	});
});
