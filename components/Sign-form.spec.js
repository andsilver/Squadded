import { Wrapper, shallowMount } from '@vue/test-utils';
import SignForm from './Sign-Form.vue';
import { requestOtp } from '~/services/otp';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

const email = 'test@test.com';

jest.mock('~/services/otp', () => ({
	requestOtp: jest.fn(),
	loginWithPIN: jest.fn(),
}));

describe('SignForm', () => {
	let wrapper;

	const EMAIL_FIELD = 'email-field';
	const SIGNIN_BTN = 'signup-otp-btn';

	beforeEach(() => {
		wrapper = shallowMount(SignForm, {
			mocks: {
				$t: msg => msg,
			},
		});
		wrapper.setData({
			email,
			otpRequested: false,
		});
	});

	it('should render correct content', () => {
		const emailField = wrapper.ref(EMAIL_FIELD);
		const signinBtn = wrapper.ref(SIGNIN_BTN);

		expect(emailField.exists()).toBe(true);
		expect(signinBtn.exists()).toBe(true);
	});

	it('should call requestOtp', () => {
		wrapper.setData({ errors: { email: false } });
		const signinBtn = wrapper.ref(SIGNIN_BTN);
		signinBtn.trigger('click');
		expect(requestOtp).toHaveBeenCalledWith(email);
	});
});
