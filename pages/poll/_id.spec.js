import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { FeedPost } from '../../classes/FeedPost';
import PollDetailsPage from './_id.vue';
import Store from '~/store';
import { prefetch } from '~/helpers';
import * as TestPoll from '~/test/testpool.json';

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
}));

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Poll Details', () => {
	const POLLDETAILS = 'poll-details';

	let $router;
	let localVue;
	let store;
	let wrapper;
	let $route = {
		params: {
			id: 'any',
		},
	};

	const initWrapper = () => {
		wrapper = shallowMount(PollDetailsPage, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
				$route,
			},
		});
	};

	beforeEach(() => {
		prefetch.mockClear();
		localVue = createLocalVue();
		localVue.use(Vuex);

		$router = {
			push: jest.fn(),
			back: jest.fn(),
		};
		store = new Vuex.Store(Store);

		initWrapper();
	});

	it('should fetch poll when component created', () => {
		expect(prefetch).toHaveBeenCalled();
	});

	it('should not display content before poll data arrives', () => {
		const pollDetails = wrapper.ref(POLLDETAILS);
		expect(pollDetails.exists()).toBe(false);
	});

	it('should display content if poll data is available', () => {
		store.state.post.pollResult = new FeedPost(TestPoll);
		const pollDetails = wrapper.ref(POLLDETAILS);
		expect(pollDetails.exists()).toBe(true);
	});

	it('should navigate back if poll id is not passed in url', () => {
		$route = {
			params: {
				id: null,
			},
		};
		initWrapper();
		expect($router.back).toHaveBeenCalled();
	});
});
