import { Wrapper, shallowMount } from '@vue/test-utils';
import SignForm from './Sign-Form.vue';
import { requestOtp, loginWithPIN } from '~/services/otp';
import { Storage } from '~/test/storage.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

const userId = '123456789';
const token = 'sometoken';
const email = 'test@test.com';
const pin = 1234;

jest.mock('~/services/otp', () => ({
	requestOtp: jest.fn(),
	loginWithPIN: jest.fn(),
}));

describe('SignForm', () => {
	let wrapper;

	const EMAIL_FIELD = 'email-field';
	const PIN_FIELD = 'pin-field';
	const SIGNIN_BTN = 'signin-button';
	const SIGNUP_OTP_BTN = 'signup-otp-btn';

	beforeEach(() => {
		wrapper = shallowMount(SignForm, {
			mocks: {
				$t: msg => msg,
			},
		});
		wrapper.setData({
			signup: false,
			email,
			pin,
			otpRequested: false,
		});
	});

	it('should render correct content', () => {
		const emailField = wrapper.ref(EMAIL_FIELD);
		const pinField = wrapper.ref(PIN_FIELD);
		const signinBtn = wrapper.ref(SIGNIN_BTN);

		expect(emailField.exists()).toBe(true);
		expect(pinField.exists()).toBe(false);
		expect(signinBtn.exists()).toBe(true);
	});

	it('should call requestOtp signin', () => {
		wrapper.setData({ errors: { email: false } });
		const signinBtn = wrapper.ref(SIGNIN_BTN);
		signinBtn.trigger('click');
		expect(requestOtp).toHaveBeenCalledWith(email);
		expect(wrapper.vm.otpRequested).toBe(true);
	});

	it('should call requestOtp signup', () => {
		wrapper.setData({ errors: { email: false }, signup: true });
		const signupOtpBtn = wrapper.ref(SIGNUP_OTP_BTN);
		signupOtpBtn.trigger('click');
		expect(requestOtp).toHaveBeenCalledWith(email);
		expect(wrapper.vm.otpRequested).toBe(true);
	});

	it('should call set token in local storage', async () => {
		global.localStorage = new Storage();
		wrapper.setData({ errors: { email: false, pin: false } });
		const signinBtn = wrapper.ref(SIGNIN_BTN);
		signinBtn.trigger('click');
		loginWithPIN.mockReturnValue(Promise.resolve({ userId, token }));
		await signinBtn.trigger('click');
		expect(loginWithPIN).toHaveBeenCalledWith(pin, email);
		const userToken = localStorage.getItem('userToken');
		expect(userToken).toBe(token);
	});
});
