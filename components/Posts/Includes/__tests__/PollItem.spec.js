import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PollItem from '../PollItem.vue';
import Store from '~/store';
import { aDefaultPollMsgBuilder } from '~/test/poll.item.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('PollItem', () => {
	const PRODUCT_CARD_ELEMENT = 'product-card';
	let wrapper;

	function initLocalVue () {
		const localVue = createLocalVue();
		const post = aDefaultPollMsgBuilder().withGUID().get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = shallowMount(PollItem, {
			localVue,
			propsData: {
				item: post.item1,
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
