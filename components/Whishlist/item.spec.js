import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Item from './item.vue';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

import { SquadAPI } from '~/services/SquadAPI';

jest.mock('~/services/SquadAPI', () => ({
	SquadAPI: {
		openProduct: jest.fn(),
	},
}));

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Whishlist Item', () => {
	const IAMGE = 'item-image';
	const PRICE = 'item-price';
	const TITLE = 'item-title';

	let post;
	let wrapper;

	function initLocalVue () {
		SquadAPI.openProduct.mockClear();
		const localVue = createLocalVue();
		localVue.use(Vuex);

		post = aDefaultSingleItemMsgBuilder().withGUID().get();
		wrapper = shallowMount(Item, {
			localVue,
			mocks: {
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
			propsData: {
				post,
			},
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should open product on click', () => {
		const triggerElements = [IAMGE, PRICE, TITLE];
		expect.assertions(4);

		triggerElements.forEach((el) => {
			const element = wrapper.ref(el);
			wrapper.vm.openProduct = jest.fn();
			element.trigger('click');
			expect(SquadAPI.openProduct).toHaveBeenCalledWith(post.item);
		});
		expect(SquadAPI.openProduct).toHaveBeenCalledTimes(3);
	});

	it('should display item\'s price with currency', () => {
		expect(wrapper.ref(PRICE).text()).toBe(`€${(post.item.price / 100).toLocaleString('en')}`);
	});
});
