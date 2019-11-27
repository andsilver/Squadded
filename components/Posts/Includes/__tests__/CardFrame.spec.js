import { Wrapper, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CardFrame from '../CardFrame.vue';
import Store from '~/store';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('CardFrame', () => {
	const PRICE = 'item-price';
	const TITLE = 'item-title';
	const BUY_BUTTON_ELEMENT = 'buy-button';
	let wrapper;

	function initLocalVue () {
		const localVue = createLocalVue();
		const post = aDefaultSingleItemMsgBuilder().withGUID().get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = mount(CardFrame, {
			localVue,
			propsData: {
				price: post.item.price,
				title: post.item.title,
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
		const triggerElements = [PRICE, TITLE];

		const open = jest.fn();
		wrapper.vm.$on('open', open);
		triggerElements.forEach((el) => {
			const element = wrapper.ref(el);
			element.trigger('click');
		});
		expect(open).toHaveBeenCalledTimes(2);
	});
});
