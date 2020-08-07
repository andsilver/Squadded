import { Wrapper, shallowMount } from '@vue/test-utils';
import QuestionPost from '../QuestionPost.vue';
import { FeedPost } from '~/classes/FeedPost';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('QuestionPost', () => {
	let wrapper;
	let post;
	const text = 'text';
	const background = 'background';
	const color = 'red';

	function initLocalVue () {
		post = new FeedPost({
			text,
			background,
			color,
			type: 'questionPost',
		});
		wrapper = shallowMount(QuestionPost, {
			propsData: {
				post,
			},
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should render correct elements', () => {
		expect(wrapper.ref('questioncard').exists()).toBe(true);
		expect(wrapper.ref('posttext').exists()).toBe(true);
	});

	it('should be able to voting', () => {
		const textarea = wrapper.ref('posttext');
		expect(textarea.element.value).toBe(text);
		expect(textarea.element.style.color).toBe(color);
	});
});
