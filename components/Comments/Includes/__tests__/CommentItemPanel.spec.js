import { Wrapper, shallowMount } from '@vue/test-utils';
import CommentItemPanel from '../CommentItemPanel.vue';
import { regularPostBuilder } from '~/test/post.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('CommentItemPanel', () => {
	let wrapper;
	const $router = {
		push: jest.fn(),
	};
	const post = regularPostBuilder().get();

	beforeEach(() => {
		wrapper = shallowMount(CommentItemPanel, {
			mocks: {
				$router,
			},
			propsData: {
				post,
			},
		});
	});

	it('should render correct contents', () => {
		const commentItemPanel = wrapper.ref('comment-item-panel');
		expect(commentItemPanel.exists()).toBe(true);
	});

	it('should emit selectEmbeddedItem event', () => {
		const commentItemPanel = wrapper.ref('comment-item-panel');
		wrapper.vm.$emit = jest.fn();
		commentItemPanel.trigger('click');
		expect(wrapper.vm.$emit).toHaveBeenCalledWith('selectEmbeddedItem', post);
	});
});
