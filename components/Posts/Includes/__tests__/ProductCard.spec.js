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
	const CARD = 'card-frame';
	let post;
	let wrapper;

	function initLocalVue () {
		SquadAPI.openProduct.mockClear();
		const localVue = createLocalVue();
		post = aDefaultSingleItemMsgBuilder().withGUID().get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = shallowMount(ProductCard, {
			localVue,
			propsData: {
				item: post.item,
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

	it('should open product on open event', () => {
		const triggerElements = [IMAGE, CARD];
		expect.assertions(5);

		triggerElements.forEach((el) => {
			const element = wrapper.ref(el);
			expect(element.exists()).toBe(true);
			element.vm.$emit('open');
			expect(SquadAPI.openProduct).toHaveBeenCalledWith(post.item);
		});
		expect(SquadAPI.openProduct).toHaveBeenCalledTimes(2);
	});

	it('should set price with currency', () => {
		expect(wrapper.ref(CARD).props('price')).toBe(`€${(post.item.price / 100).toLocaleString('en')}`);
	});
});
