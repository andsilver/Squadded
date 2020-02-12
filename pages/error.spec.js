import { Wrapper, shallowMount } from '@vue/test-utils';
import Error from './error.vue';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Error Page', () => {
	let wrapper;

	const $router = {
		push: jest.fn(),
	};
	const IMAGES = 'images';
	const ERROR_TEXT = 'error-text';
	const GO_TO_FEED_BUTTON = 'go-to-feed-button';

	beforeEach(() => {
		wrapper = shallowMount(Error, {
			mocks: {
				$router,
				$t: msg => msg,
			},
		});
	});

	it('should render correct content', () => {
		expect(wrapper.ref(IMAGES).exists()).toBe(true);
		expect(wrapper.ref(ERROR_TEXT).exists()).toBe(true);
		expect(wrapper.ref(GO_TO_FEED_BUTTON).exists()).toBe(true);
	});

	it('should go to feed page', async () => {
		await wrapper.ref(GO_TO_FEED_BUTTON).trigger('click');
		expect($router.push).toHaveBeenCalledWith('/feed');
	});
});
