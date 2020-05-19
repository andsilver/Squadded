import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Signup from './index.vue';
import Store from '~/store';
import { loginWithPIN } from '~/services/otp';

const token = 'sometoken';
const email = 'test@test.com';
const pin = 1234;

jest.mock('~/services/otp', () => ({
	loginWithPIN: jest.fn(),
}));

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Signup', () => {
	let localVue;
	let store;
	let wrapper;
	const $route = {
		query: {},
	};

	const STEP_ONE = 'step-one';
	const STEP_TWO = 'step-two';
	const SIGN_FORM = 'signForm';
	const GO_BACK_BTN = 'go-back-btn';
	const VALIDATE_BTN = 'signup-validate-btn';
	const ERROR_MESSAGE = 'error-message';
	const SOCIAL_LOGIN = 'social-login';

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);

		wrapper = shallowMount(Signup, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$route,
			},
		});
		wrapper.vm.$root = {
			$i18n: {
				fallbackLocale: 'fr',
			},
		};
	});

	it('should render correct contents', () => {
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);

		const signForm = wrapper.ref(SIGN_FORM);
		const goBackBtn = wrapper.ref(GO_BACK_BTN);
		const validateBtn = wrapper.ref(VALIDATE_BTN);
		expect(signForm.exists()).toBe(true);
		expect(goBackBtn.exists()).toBe(true);
		expect(validateBtn.exists()).toBe(true);
	});

	it('should go to step two', () => {
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);
		const stepOne = wrapper.ref(STEP_ONE);
		const stepTwo = wrapper.ref(STEP_TWO);
		const signForm = wrapper.ref(SIGN_FORM);
		expect(stepTwo.classes('in_active')).toBe(true);
		signForm.vm.$emit('sendOtp', email);
		expect(stepTwo.classes('active')).toBe(true);
		expect(stepOne.classes('in_active')).toBe(true);
	});

	it('should post loggedIn message', async () => {
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);
		wrapper.setData({ pin });
		const merchantId = 'merchant-id';
		store.state.merchant.id = merchantId;
		const signForm = wrapper.ref(SIGN_FORM);
		const validateBtn = wrapper.ref(VALIDATE_BTN);
		loginWithPIN.mockReturnValue(Promise.resolve({ token }));
		signForm.vm.$emit('sendOtp', email);
		window.postMessage = jest.fn();
		await validateBtn.trigger('click');
		expect(loginWithPIN).toHaveBeenCalledWith(pin, email, { merchantId, origin: 'normal', language: 'fr' });
		expect(window.postMessage).toHaveBeenCalledWith(JSON.stringify({
			type: 'loggedIn',
			userToken: token,
		}), window.origin);
	});

	it('should show error message if pin is not correct', async () => {
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);
		wrapper.setData({ pin });
		const signForm = wrapper.ref(SIGN_FORM);
		const validateBtn = wrapper.ref(VALIDATE_BTN);
		loginWithPIN.mockReturnValue(Promise.resolve({ error: true }));
		signForm.vm.$emit('sendOtp', email);
		await validateBtn.trigger('click');
		expect(wrapper.ref(ERROR_MESSAGE).exists()).toBe(true);
	});

	it('should post login with invitation origin', async () => {
		const userId = 'userId';
		$route.query = { userId };
		wrapper = shallowMount(Signup, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$route,
			},
		});
		wrapper.vm.$root = {
			$i18n: {
				fallbackLocale: 'fr',
			},
		};
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);
		wrapper.setData({ pin });
		const merchantId = 'merchant-id';
		store.state.merchant.id = merchantId;
		const signForm = wrapper.ref(SIGN_FORM);
		const validateBtn = wrapper.ref(VALIDATE_BTN);
		loginWithPIN.mockReturnValue(Promise.resolve({ token }));
		signForm.vm.$emit('sendOtp', email);
		await validateBtn.trigger('click');
		expect(loginWithPIN).toHaveBeenCalledWith(pin, email, {
			merchantId,
			origin: 'invitation',
			language: 'fr',
			originUserId: userId,
		});
	});

	it('should post login with share origin', async () => {
		const postId = 'postId';
		$route.query = { postId };
		wrapper = shallowMount(Signup, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$route,
			},
		});
		wrapper.vm.$root = {
			$i18n: {
				fallbackLocale: 'fr',
			},
		};
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);
		wrapper.setData({ pin });
		const merchantId = 'merchant-id';
		store.state.merchant.id = merchantId;
		const signForm = wrapper.ref(SIGN_FORM);
		const validateBtn = wrapper.ref(VALIDATE_BTN);
		loginWithPIN.mockReturnValue(Promise.resolve({ token }));
		signForm.vm.$emit('sendOtp', email);
		await validateBtn.trigger('click');
		expect(loginWithPIN).toHaveBeenCalledWith(pin, email, {
			merchantId,
			origin: 'share',
			language: 'fr',
			originPostId: postId,
		});
	});

	it('should post open-link on clicking show terms', () => {
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);
		const ref = wrapper.ref('show-terms');
		expect(ref.exists()).toBe(true);
		window.parent.postMessage = jest.fn();
		ref.trigger('click');
		expect(window.parent.postMessage).toHaveBeenCalledWith(JSON.stringify({
			type: 'open-link',
			link: 'https://www.squadded.co/privacy-policy',
		}), '*');
	});

	it('should not render social login', () => {
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);

		expect(wrapper.ref(SOCIAL_LOGIN).exists()).toBe(true);
		store.state.merchant.squadSLogin = false;
		expect(wrapper.ref(SOCIAL_LOGIN).exists()).toBe(false);
	});
});
