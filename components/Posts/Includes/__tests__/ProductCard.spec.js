import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ProductCard from '../ProductCard.vue';
import Store from '~/store';
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

describe('ProductCard', () => {
	const IMAGE = 'item-image';
	const PRICE = 'item-price';
	const TITLE = 'item-title';
	const BUY_BUTTON_ELEMENT = 'buy-button';
	let wrapper;

	function initLocalVue () {
		SquadAPI.openProduct.mockClear();
		const localVue = createLocalVue();
		const post = aDefaultSingleItemMsgBuilder().withGUID().get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = shallowMount(ProductCard, {
			localVue,
			propsData: {
				item: post.item,
			},
			store,
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should render buy button', () => {
		expect(wrapper.ref(BUY_BUTTON_ELEMENT).exists()).toBe(true);
	});

	it('should open product on click', () => {
		const triggerElements = [IMAGE, PRICE, TITLE];
		const postItem = wrapper.props('item');
		expect.assertions(4);

		triggerElements.forEach((el) => {
			const element = wrapper.ref(el);
			wrapper.vm.openProduct = jest.fn();
			element.trigger('click');
			expect(SquadAPI.openProduct).toHaveBeenCalledWith(postItem);
		});
		expect(SquadAPI.openProduct).toHaveBeenCalledTimes(3);
	});
});
