import { Wrapper, shallowMount } from '@vue/test-utils';
import CommentPreview from '../CommentPreview.vue';
import { regularPostBuilder } from '~/test/post.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('CommentPreview', () => {
	let wrapper;
	const $router = {
		push: jest.fn(),
	};
	const post = regularPostBuilder().get();

	beforeEach(() => {
		wrapper = shallowMount(CommentPreview, {
			mocks: {
				$router,
			},
			propsData: {
				selectedPosts: [post],
			},
		});
	});

	it('should render correct contents', () => {
		const commentPreviewBox = wrapper.ref('comment-preview-box');
		expect(commentPreviewBox.exists()).toBe(true);
	});

	it('should emit close event', () => {
		const closePreview = wrapper.ref('close-preview-0');
		wrapper.vm.$emit = jest.fn();
		closePreview.trigger('click');
		expect(wrapper.vm.$emit).toHaveBeenCalledWith('close', post);
	});
});
