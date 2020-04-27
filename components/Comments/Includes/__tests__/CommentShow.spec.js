import { Wrapper, shallowMount } from '@vue/test-utils';
import CommentShow from '../CommentShow.vue';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('CommentShow', () => {
	let wrapper;
	const $router = {
		push: jest.fn(),
	};
	const comment = '@[yash](id:5e43e363170ae8fce3af970f) comment';

	beforeEach(() => {
		wrapper = shallowMount(CommentShow, {
			mocks: {
				$router,
			},
			propsData: {
				comment,
			},
		});
	});

	it('should render correct contents', () => {
		const commentRef = wrapper.ref('comment');
		expect(commentRef.exists()).toBe(true);
	});
});
