import { Wrapper, shallowMount } from '@vue/test-utils';
import CommentShow from '../CommentShow.vue';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('CommentShow', () => {
	let wrapper;
	const $router = {
		push: jest.fn(),
	};
	const comment = '@[yash](id:5e43e363170ae8fce3af970f) comment';
	const post = aDefaultSingleItemMsgBuilder().withGUID().withComment().get();
	beforeEach(() => {
		wrapper = shallowMount(CommentShow, {
			mocks: {
				$router,
			},
			propsData: {
				comment,
				post,
			},
		});
	});

	it('should render correct contents', () => {
		const commentRef = wrapper.ref('comment');
		expect(commentRef.exists()).toBe(true);
	});

	it('should have a post link', () => {
		const COMMENT_SHOW_ELEMENT = 'comment-show';
		expect(wrapper.classes()).toContain(COMMENT_SHOW_ELEMENT);
		expect(wrapper.classes(COMMENT_SHOW_ELEMENT)).toBe(true);
	});
});
