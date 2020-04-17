import { Wrapper, shallowMount } from '@vue/test-utils';
import Topbar from './Topbar.vue';
import { FeedPost } from '~/classes/FeedPost';
import * as TestPoll from '~/test/testpool.json';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Poll Details Topbar', () => {
	let wrapper;

	const GO_BACK_BTN = 'go-back-btn';
	const POLL_DETAILS_TITLE = 'poll-details-title';
	// const POPMENU = 'popmenu';

	beforeEach(() => {
		wrapper = shallowMount(Topbar, {
			propsData: { post: new FeedPost(TestPoll) },
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should display content', () => {
		const goBackBtn = wrapper.ref(GO_BACK_BTN);
		const pollDetailsTitle = wrapper.ref(POLL_DETAILS_TITLE);
		// const popmenu = wrapper.ref(POPMENU);

		expect(goBackBtn.exists()).toBe(true);
		expect(pollDetailsTitle.exists()).toBe(true);
		// expect(popmenu.exists()).toBe(true);
	});
});
