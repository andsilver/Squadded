import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SingleItemPost from '../SingleItemPost.vue';
import Store from '~/store';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('SingleItemPost', () => {
	const PRODUCT_CARD_ELEMENT = 'product-card';
	let wrapper;

	function initLocalVue () {
		const localVue = createLocalVue();
		const post = aDefaultSingleItemMsgBuilder().withGUID().get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = shallowMount(SingleItemPost, {
			localVue,
			propsData: {
				post,
			},
			store,
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should render product card', () => {
		expect(wrapper.ref(PRODUCT_CARD_ELEMENT).exists()).toBe(true);
	});
});
