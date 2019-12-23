import { Wrapper, shallowMount } from '@vue/test-utils';
import PollDetails from './index.vue';
import Voter from './Includes/Voter.vue';
import Votes from './Includes/Votes.vue';
import { FeedPost } from '~/classes/FeedPost';
import * as TestPoll from '~/test/testpool.json';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Poll Details', () => {
	let wrapper;

	const POLL_ITEM1 = 'poll-item1';
	const POLL_ITEM2 = 'poll-item2';
	const ITEM_VOTES1 = 'votes1';
	const ITEM_VOTES2 = 'votes2';

	beforeEach(() => {
		wrapper = shallowMount(PollDetails, {
			propsData: { post: new FeedPost(TestPoll) },
		});
	});

	it('should display items', () => {
		const pollItem1 = wrapper.ref(POLL_ITEM1);
		const pollItem2 = wrapper.ref(POLL_ITEM2);

		expect(pollItem1.exists()).toBe(true);
		expect(pollItem2.exists()).toBe(true);
	});

	it('should display votes', () => {
		const votes1 = wrapper.ref(ITEM_VOTES1);
		const votes2 = wrapper.ref(ITEM_VOTES2);
		expect(votes1.is(Votes)).toBe(true);
		expect(votes2.is(Votes)).toBe(true);
	});

	it('should display all voters', () => {
		expect(wrapper.findAll(Voter).length).toBe(TestPoll.item1.voters.length + TestPoll.item2.voters.length);
	});
});
