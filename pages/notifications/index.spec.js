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
	const NOTIFICATIONS_LIST = 'notification-list';

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
		let notificationList = wrapper.ref(NOTIFICATIONS_LIST);
		expect(backBar.exists()).toBe(true);
		expect(emptyNotifyText.exists()).toBe(true);
		expect(notificationList.exists()).toBe(false);

		store.commit(`${NotificationStore}/${NotificationMutations.receive}`, {
			notifications: [{
				viewed: false,
			}],
		});

		notificationList = wrapper.ref(NOTIFICATIONS_LIST);
		emptyNotifyText = wrapper.ref(EMPTY_NOTIF_TEXT);
		expect(notificationList.exists()).toBe(true);
		expect(emptyNotifyText.exists()).toBe(false);
	});

	it('should fetch notifications', () => {
		store.dispatch = jest.fn();
		initLocalVue();
		expect(store.dispatch).toHaveBeenCalledWith(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
	});

	it('should set viewAll', () => {
		jest.useFakeTimers();
		store.commit = jest.fn();
		initLocalVue();
		jest.advanceTimersByTime(5000);
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.viewAll}`);
	});
});
