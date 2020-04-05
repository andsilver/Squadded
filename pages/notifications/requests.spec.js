import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Requests from './requests.vue';
import Store from '~/store';
import { NotificationStore, NotificationMutations } from '~/store/notification';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Notifications Requests', () => {
	let localVue;
	let store;
	let wrapper;

	const BACK_BAR = 'goback-button';
	const EMPTY_NOTIF_TEXT = 'empty-notif-text';
	const NOTIFICATIONS_LIST = 'notification-list';

	const initLocalVue = () => {
		wrapper = shallowMount(Requests, {
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
		const emptyNotifyText = wrapper.ref(EMPTY_NOTIF_TEXT);
		const notificationList = wrapper.ref(NOTIFICATIONS_LIST);
		expect(backBar.exists()).toBe(true);
		expect(emptyNotifyText.exists()).toBe(true);
		expect(notificationList.exists()).toBe(false);

		store.commit(`${NotificationStore}/${NotificationMutations.receive}`, {
			notifications: [{
				viewed: false,
				user: {},
			}],
		});
	});
});
