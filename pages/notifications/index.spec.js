import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Notifications from './index.vue';
import Store from '~/store';
import { NotificationStore, NotificationActions, NotificationMutations } from '~/store/notification';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Notifications', () => {
	let localVue;
	let store;
	let wrapper;

	const BACK_BAR = 'goback-button';
	const EMPTY_NOTIF_TEXT = 'empty-notif-text';
	const NEW_NOTIFICATIONS = 'new-notify';
	const OLD_NOTIFICATIONS = 'old-notify';

	const initLocalVue = () => {
		wrapper = shallowMount(Notifications, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
			},
		});
		store.commit('SET_SOCKET_AUTH', true);
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
	});

	it('should render correct contents', () => {
		initLocalVue();
		const backBar = wrapper.ref(BACK_BAR);
		let emptyNotifyText = wrapper.ref(EMPTY_NOTIF_TEXT);
		let newNotifications = wrapper.ref(NEW_NOTIFICATIONS);
		let oldNotifications = wrapper.ref(OLD_NOTIFICATIONS);
		expect(backBar.exists()).toBe(true);
		expect(emptyNotifyText.exists()).toBe(true);
		expect(newNotifications.exists()).toBe(false);

		store.commit(`${NotificationStore}/${NotificationMutations.receive}`, {
			notifications: [{
				viewed: false,
				user: {},
			}],
		});

		newNotifications = wrapper.ref(NEW_NOTIFICATIONS);
		oldNotifications = wrapper.ref(OLD_NOTIFICATIONS);
		emptyNotifyText = wrapper.ref(EMPTY_NOTIF_TEXT);
		expect(newNotifications.exists()).toBe(true);
		expect(oldNotifications.exists()).toBe(true);
		expect(emptyNotifyText.exists()).toBe(false);
	});

	it('should fetch notifications', () => {
		store.dispatch = jest.fn();
		initLocalVue();
		expect(store.dispatch).toHaveBeenCalledWith(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
	});

	it('should view notifications', () => {
		store.dispatch = jest.fn();
		initLocalVue();
		expect(store.dispatch).toHaveBeenCalledWith(`${NotificationStore}/${NotificationActions.viewNotifications}`, []);
	});
});
