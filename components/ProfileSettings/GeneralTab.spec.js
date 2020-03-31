import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import GeneralTab from './GeneralTab.vue';
import Store from '~/store';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { NOTIFICATIONS } from '~/consts/notifications';
import { signOut } from '~/plugins/init/ws';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

jest.mock('~/plugins/init/ws', () => ({
	signOut: jest.fn(),
}));

describe('Profile Settings Topbar', () => {
	let wrapper;
	let store;
	let localVue;
	const $router = {
		push: jest.fn(),
	};
	const $ws = {
		sendObj: jest.fn(),
	};

	const SIGN_OUT_BUTTON = 'sign-out-button';
	const CONFIRM_SIGNOUT_BTN = 'confirm-signout';

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		wrapper = shallowMount(GeneralTab, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
				$ws,
			},
		});
	});

	it('should call signOut', () => {
		wrapper.ref(SIGN_OUT_BUTTON).trigger('click');
		wrapper.ref(CONFIRM_SIGNOUT_BTN).trigger('click');
		expect(signOut).toHaveBeenCalledWith(store, $router);
	});

	it('should submit feedback', () => {
		store.commit = jest.fn();
		const submitButton = wrapper.ref('submit-btn');
		expect(wrapper.ref('feedback-label').exists()).toBe(true);
		expect(wrapper.ref('feedback-field').exists()).toBe(true);
		expect(submitButton.exists()).toBe(true);
		expect(wrapper.vm.submitted).toBe(false);
		submitButton.trigger('click');
		expect(wrapper.vm.submitted).toBe(true);
		expect(wrapper.ref('feedback-label').classes()).toContain('isError');
		wrapper.setData({
			feedback: 'feedback',
		});
		global.Date = {
			now: jest.fn().mockReturnValue(123456789),
		};
		submitButton.trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'feedbackPost',
			feedback: 'feedback',
		});
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.add}`, {
			type: NOTIFICATIONS.ALERT,
			text: wrapper.vm.$t('profile_settings.submitted_notification'),
			ts: 123456789,
			_id: 123456789,
		});
	});
});
