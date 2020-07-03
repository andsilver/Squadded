import { Wrapper, shallowMount } from '@vue/test-utils';
import NotSignedInDialog from './NotSignedInDialog.vue';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Landing Post - NotSigendInDialog', () => {
	let wrapper;
	let user;
	const $router = {
		push: jest.fn(),
	};

	const TEXT = 'text';
	const SIGN_IN_BTN = 'sign-in-btn';
	const SKIP_BTN = 'skip-btn';

	beforeEach(() => {
		user = userMockBuilder().short();
		wrapper = shallowMount(NotSignedInDialog, {
			data: {
				show: true,
			},
			propsData: {
				user,
			},
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	});

	it('should render correct contents', () => {
		const text = wrapper.ref(TEXT);
		const signInBtn = wrapper.ref(SIGN_IN_BTN);
		const skipBtn = wrapper.ref(SKIP_BTN);
		expect(text.exists()).toBe(true);
		expect(signInBtn.exists()).toBe(true);
		expect(skipBtn.exists()).toBe(true);
	});

	it('should navigate to signin page with post id', () => {
		const postId = 'postId';
		wrapper.setProps({
			postId,
		});
		const signInBtn = wrapper.ref(SIGN_IN_BTN);
		signInBtn.trigger('click');
		expect($router.push).toHaveBeenCalledWith({
			path: '/',
			query: {
				postId,
			},
		});
	});
});
