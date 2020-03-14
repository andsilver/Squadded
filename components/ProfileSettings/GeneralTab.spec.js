import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import GeneralTab from './GeneralTab.vue';
import Store from '~/store';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { UserStore, UserActions, UserMutations } from '~/store/user';
import { NOTIFICATIONS } from '~/consts/notifications';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Profile Settings Topbar', () => {
	let wrapper;
	let store;
	let localVue;
	let user;
	const $router = {
		push: jest.fn(),
	};
	const $ws = {
		sendObj: jest.fn(),
	};

	const SIGN_OUT_BUTTON = 'sign-out-button';
	const SAVE_BUTTON = 'save-button';

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		user = userMockBuilder().get();
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
		wrapper.vm.$root = {
			$i18n: {
				fallbackLocale: 'en',
			},
		};
	});

	it('should have cleared the sessionStorage and localStorage', () => {
		const signOutButton = wrapper.ref(SIGN_OUT_BUTTON);
		signOutButton.trigger('click');
		expect(sessionStorage.length).toBe(0);
		expect(localStorage.length).toBe(0);
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

	it('should save profile on save button click', async () => {
		const saveButton = wrapper.ref(SAVE_BUTTON);
		user.language = 'fr';
		user.isMe = true;
		store.dispatch = jest.fn();
		await store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		saveButton.trigger('click');
		expect(store.dispatch).toHaveBeenCalledWith(`${UserStore}/${UserActions.setProfile}`, user);
	});
});
