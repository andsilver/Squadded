import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import EndingPolls from './EndingPolls.vue';
import Store from '~/store';
import { ExploreStore, ExploreMutations } from '~/store/explore';
import { aDefaultPollMsgBuilder } from '~/test/poll.post.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Ending Polls', () => {
	const ENDING_POLLS_TITLE = 'ending-polls-title';
	const EMPTY_FEED_TEXT = 'empty-feed-text';

	let wrapper;
	let store;
	let localVue;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);

		wrapper = shallowMount(EndingPolls, {
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
		expect(wrapper.ref(ENDING_POLLS_TITLE).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);

		const items = new Array(20).fill(aDefaultPollMsgBuilder().get());
		store.commit(`${ExploreStore}/${ExploreMutations.setItems}`, {
			type: 'endingPolls',
			content: {
				items,
				ts: Date.now(),
			},
		});
		const polls = wrapper.findAll('.wrapper');
		expect(polls.length).toBe(20);
	});
});
