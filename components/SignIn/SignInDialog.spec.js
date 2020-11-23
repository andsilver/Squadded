import { Wrapper, shallowMount } from '@vue/test-utils';
import SignInDialog from './SignInDialog.vue';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Sign in dialog', () => {
	const SIGNIN_BUTTON = 'signin-button';

	let wrapper;
	const $router = {
		push: jest.fn(),
	};
	const $store = {
		state: {
			socket: {
				isAuth: false,
			},
		},
	};

	beforeEach(() => {
		wrapper = shallowMount(SignInDialog, {
			mocks: {
				$t: msg => msg,
				$router,
				$store,
			},
		});
	});

	it('should go to signin when clinking button', () => {
		const singinButton = wrapper.ref(SIGNIN_BUTTON);
		singinButton.trigger('click');
		expect($router.push).toHaveBeenCalledWith('/');
	});
});
