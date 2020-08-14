import { Wrapper, shallowMount } from '@vue/test-utils';
import CommentPanel from '../CommentPanel.vue';
import { regularPostBuilder } from '~/test/post.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('CommentPanel', () => {
	let wrapper;
	const $router = {
		push: jest.fn(),
	};
	const post = regularPostBuilder().get();

	beforeEach(() => {
		wrapper = shallowMount(CommentPanel, {
			mocks: {
				$router,
			},
			propsData: {
				wishlist: null,
			},
		});
	});

	it('should render correct contents', () => {
		const commentPanelBox = wrapper.ref('comment-panel-box');
		expect(commentPanelBox.exists()).toBe(true);
	});

	it('should render preloader if no wishlist', () => {
		const preloader = wrapper.ref('preloader');
		expect(preloader.exists()).toBe(true);
	});

	it('should render commentitempanel if wishlist', () => {
		wrapper.setProps({ wishlist: [post] });
		const commentItemPanel = wrapper.ref('comment-item-panel-0');
		expect(commentItemPanel.exists()).toBe(true);
	});
});
