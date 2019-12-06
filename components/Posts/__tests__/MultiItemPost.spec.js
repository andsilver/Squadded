import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MultiItemPost from '../MultiItemPost.vue';
import Store from '~/store';
import { outfitPostBuilder } from '~/test/outfit.post.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('MultiItemPost', () => {
	const MULTI_ITEM = 'multi-item';
	let post;
	let wrapper;

	function initLocalVue () {
		const localVue = createLocalVue();
		post = outfitPostBuilder().withGUID().get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = shallowMount(MultiItemPost, {
			localVue,
			propsData: {
				post,
			},
			mocks: {
				_i18n: {
					locale: 'en',
				},
			},
			store,
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should render multi item card', () => {
		expect(wrapper.ref(MULTI_ITEM).exists()).toBe(true);
	});

	it('should set total price with currency', () => {
		const total = post.items.map(i => i.price).reduce((a, b) => (a + (+b)), 0);
		expect(wrapper.ref(MULTI_ITEM).props('price')).toBe(`€${(total / 100).toLocaleString('en')}`);
	});
});
