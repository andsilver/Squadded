import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PollItem from '../PollItem.vue';
import Store from '~/store';
import { aDefaultPollMsgBuilder } from '~/test/poll.post.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('PollItem', () => {
	const PRODUCT_CARD_ELEMENT = 'product-card';
	const POLL_ITEM_VOTES_COUNT_ELEMENT = 'poll-item-votes-count';
	let post;
	let wrapper;

	function initLocalVue () {
		const localVue = createLocalVue();
		post = aDefaultPollMsgBuilder().withGUID().withItem1Votes(19).withItem2Votes(18).get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = shallowMount(PollItem, {
			localVue,
			propsData: {
				item: post.item1,
				voted: false,
				total: post.item1.votes + post.item2.votes,
			},
			mocks: {
				$t: msg => msg,
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

	it('should render product card', () => {
		expect(wrapper.ref(PRODUCT_CARD_ELEMENT).exists()).toBe(true);
	});

	it('should not display votes', () => {
		wrapper.setProps({
			details: true,
		});
		expect(wrapper.ref(POLL_ITEM_VOTES_COUNT_ELEMENT).exists()).toBe(false);
	});

	it('should display votes', () => {
		wrapper.setProps({
			voted: true,
			details: true,
		});

		expect(wrapper.ref(POLL_ITEM_VOTES_COUNT_ELEMENT).exists()).toBe(true);
		expect(wrapper.ref(POLL_ITEM_VOTES_COUNT_ELEMENT).text()).toMatch('51%');
	});

	it('should set price with currency', () => {
		expect(wrapper.ref(PRODUCT_CARD_ELEMENT).props('price')).toBe(`€${(post.item1.price / 100).toLocaleString('en')}`);
	});
});
