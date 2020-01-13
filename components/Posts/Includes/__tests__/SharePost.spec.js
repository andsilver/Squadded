import { Wrapper, shallowMount } from '@vue/test-utils';
import SharePost from '../SharePost.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Share Post', () => {
	let wrapper;
	let postLink;

	const POST_LINK = 'post-link';
	const COPY_ICON = 'copy-icon';

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
		const copyIcon = wrapper.ref(COPY_ICON);
		expect(postLink.exists()).toBe(true);
		expect(copyIcon.exists()).toBe(true);
	});
});
