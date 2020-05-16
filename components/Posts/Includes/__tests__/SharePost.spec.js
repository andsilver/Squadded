import { Wrapper, shallowMount } from '@vue/test-utils';
import SharePost from '../SharePost.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Share Post', () => {
	let wrapper;
	let postLink;

	const POST_LINK = 'post-link';

	beforeEach(() => {
		postLink = 'somelink';
		wrapper = shallowMount(SharePost, {
			propsData: {
				postLink,
			},
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should display post link text box with copy icon', () => {
		const postLink = wrapper.ref(POST_LINK);
		expect(postLink.exists()).toBe(true);
	});
});
