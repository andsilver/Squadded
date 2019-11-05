import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PollPost from '../PollPost.vue';
import Store from '~/store';
import { aDefaultPollMsgBuilder } from '~/test/poll.item.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('PollPost', () => {
	const POLL_ITEM_ELEMENT_1 = 'poll-item1';
	const POLL_ITEM_ELEMENT_2 = 'poll-item2';
	let wrapper;
	let post;

	function initLocalVue () {
		const localVue = createLocalVue();
		post = aDefaultPollMsgBuilder().withGUID().get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = shallowMount(PollPost, {
			localVue,
			propsData: {
				post,
			},
			store,
		});
		wrapper.vm.vote = jest.fn();
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should render two poll items', () => {
		expect(wrapper.ref(POLL_ITEM_ELEMENT_1).exists()).toBe(true);
		expect(wrapper.ref(POLL_ITEM_ELEMENT_2).exists()).toBe(true);
	});

	it('should be able to voting', () => {
		wrapper.ref(POLL_ITEM_ELEMENT_1).trigger('click');

		expect(wrapper.vm.vote).toHaveBeenCalledWith(post.item1);
		expect(wrapper.vm.vote).toHaveBeenCalledTimes(1);
	});

	it('should not be able to voting', () => {
		post.voted = true;

		wrapper.ref(POLL_ITEM_ELEMENT_1).trigger('click');
		expect(wrapper.vm.vote).not.toHaveBeenCalledWith();
	});
});
