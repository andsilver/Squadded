import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Signup from './index.vue';
import Store from '~/store';
import { loginWithPIN } from '~/services/otp';
import { Storage } from '~/test/storage.mock';

const userId = '123456789';
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

	const STEP_ONE = 'step-one';
	const STEP_TWO = 'step-two';
	const SIGN_FORM = 'sign-form';
	const GO_BACK_BTN = 'go-back-btn';
	const PIN_FIELD = 'pin-field';
	const VALIDATE_BTN = 'signup-validate-btn';

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);

		wrapper = shallowMount(Signup, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should render correct contents', () => {
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);

		const signForm = wrapper.ref(SIGN_FORM);
		const goBackBtn = wrapper.ref(GO_BACK_BTN);
		const pinField = wrapper.ref(PIN_FIELD);
		const validateBtn = wrapper.ref(VALIDATE_BTN);
		expect(signForm.exists()).toBe(true);
		expect(goBackBtn.exists()).toBe(true);
		expect(pinField.exists()).toBe(true);
		expect(validateBtn.exists()).toBe(true);
	});

	it('should go to step two', () => {
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);
		const stepOne = wrapper.ref(STEP_ONE);
		const stepTwo = wrapper.ref(STEP_TWO);
		const signForm = wrapper.ref(SIGN_FORM);
		expect(stepOne.classes('active')).toBe(true);
		expect(stepTwo.classes('in_active')).toBe(true);
		signForm.vm.$emit('sendOtp', email);
		expect(stepTwo.classes('active')).toBe(true);
		expect(stepOne.classes('in_active')).toBe(true);
	});

	it('should set token in local storage', async () => {
		global.localStorage = new Storage();
		store.commit('SET_SOCKET_AUTH', false);
		store.commit('SET_PENDING', false);
		wrapper.setData({ pin });
		const signForm = wrapper.ref(SIGN_FORM);
		const validateBtn = wrapper.ref(VALIDATE_BTN);
		loginWithPIN.mockReturnValue(Promise.resolve({ userId, token }));
		signForm.vm.$emit('sendOtp', email);
		await validateBtn.trigger('click');
		expect(loginWithPIN).toHaveBeenCalledWith(pin, email);
		const userToken = localStorage.getItem('userToken');
		expect(userToken).toBe(token);
	});
});
