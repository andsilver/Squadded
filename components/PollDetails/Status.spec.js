import { Wrapper, shallowMount } from '@vue/test-utils';
import Status from './Status.vue';
import { FeedPost } from '~/classes/FeedPost';
import * as TestPoll from '~/test/testpool.json';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Poll Details Status', () => {
	let wrapper;

	const EXPIRATION = 'expiration';
	const VOTES = 'votes';

	beforeEach(() => {
		window.moment = _date => ({ fromNow: jest.fn() });
		window.moment.locale = jest.fn();

		wrapper = shallowMount(Status, {
			propsData: { post: new FeedPost(TestPoll) },
			mocks: {
				$t: msg => msg,
				$tc: (msg, _count) => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});
	});

	it('should display content', () => {
		const expiration = wrapper.ref(EXPIRATION);
		const votes = wrapper.ref(VOTES);

		expect(expiration.exists()).toBe(true);
		expect(votes.exists()).toBe(true);
	});

	it('should display correct votes count', () => {
		const votes = wrapper.ref(VOTES);
		const votesnum = TestPoll.item1.votes + TestPoll.item2.votes;
		expect(votes.text().indexOf(votesnum)).toBe(0);
	});
});
