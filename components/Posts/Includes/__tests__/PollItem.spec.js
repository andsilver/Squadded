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
	const POLL_ITEM_VOTES_COUNT_ELEMENT = 'poll-item-votes-count';
	let wrapper;

	function initLocalVue () {
		const localVue = createLocalVue();
		const post = aDefaultPollMsgBuilder().withGUID().withItem1Votes(18).withItem2Votes(18).get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = shallowMount(PollItem, {
			localVue,
			propsData: {
				item: post.item1,
				voted: false,
				oppositeVotes: post.item2.votes,
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
		expect(wrapper.ref(POLL_ITEM_VOTES_COUNT_ELEMENT).exists()).toBe(false);
	});

	it('should display votes', () => {
		wrapper.setProps({
			voted: true,
		});

		const votes = 50;

		expect(wrapper.ref(POLL_ITEM_VOTES_COUNT_ELEMENT).exists()).toBe(true);
		expect(wrapper.ref(POLL_ITEM_VOTES_COUNT_ELEMENT).text()).toMatch(`${votes}%`);
	});
});
