import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import {
	NotificationStore,
	NotificationActions,
	mutations,
	STORAGE_NOTIFICATIONS_KEY,
} from './notification';
import store from './index';
import { Storage } from '~/test/storage.mock';
import TestAcceptSquad from '~/test/test-accept-squad.json';
import { NOTIFICATIONS_LIMIT } from '~/consts/notifications';

describe('Notification store module', () => {
	describe('mutations', () => {
		const { add, viewAll, receive, setAcceptedSquad } = mutations;

		let state;

		beforeEach(() => {
			state = {
				notifications: [],
			};
		});

		it('should add a notification', () => {
			const notification = { _id: 'id' };
			add(state, notification);
			expect(state.notifications.length).toBe(1);
		});

		it('should view all notifications', () => {
			const notification = { _id: 'id' };
			state.notifications = [notification];
			viewAll(state);
			expect(notification.viewed).toBe(true);
		});

		it('should receive notifications', () => {
			global.sessionStorage = new Storage();
			window.parent.postMessage = jest.fn();
			const notifications = [{ _id: 1, viewed: false }];
			state.notifications = notifications;
			const newNotifications = [
				{
					_id: 1,
					viewed: false,
				},
				{
					_id: 2,
					viewed: false,
				},
			];
			receive(state, {
				notifications: newNotifications,
			});
			const length = JSON.parse(sessionStorage.getItem(STORAGE_NOTIFICATIONS_KEY)).items.length;
			expect(state.notifications.length).toBe(2);
			expect(window.parent.postMessage).toHaveBeenCalledWith(
				JSON.stringify({
					type: 'notification',
				}),
				'*',
			);
			expect(length).toBe(2);
		});

		it('should accept squad', () => {
			state.notifications = [TestAcceptSquad];
			setAcceptedSquad(state, TestAcceptSquad._id);
			expect(TestAcceptSquad.accepted).toBe(true);
		});

		it(`should keep only last ${NOTIFICATIONS_LIMIT} notifications`, () => {
			state.notifications = [];
			receive(state, { notifications: new Array(NOTIFICATIONS_LIMIT + 3).fill(TestAcceptSquad) });
			expect(state.notifications.length).toBe(NOTIFICATIONS_LIMIT);
			add(state, TestAcceptSquad);
			expect(state.notifications.length).toBe(NOTIFICATIONS_LIMIT);
		});
	});

	describe('actions', () => {
		let root;
		let $ws;

		const aDummyMerchantId = 'aDummyMerchantId';

		beforeEach(() => {
			const localVue = createLocalVue();
			localVue.use(Vuex);
			$ws = { sendObj: jest.fn() };
			root = new Vuex.Store(store);
			root.state.socket.isConnected = true;
			root.state.merchant.id = aDummyMerchantId;
			root.state.socket.$ws = $ws;
			root.state.commit = jest.fn();
			global.sessionStorage = new Storage();
		});

		it('should send fetchNotifications', async () => {
			sessionStorage.removeItem(STORAGE_NOTIFICATIONS_KEY);
			await root.dispatch(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
				type: 'fetchNotifications',
			});
		});

		it('should not fetch from backend if items were saved in session within 1 minute', async () => {
			const items = [{ _id: 1 }];
			const ts = Date.now();
			sessionStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify({ items, ts }));
			await root.dispatch(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
			expect(root.state.socket.$ws.sendObj).not.toHaveBeenCalled();
		});

		it('should send viewNotifications', async () => {
			const notifications = [{ _id: 1, viewed: true }, { _id: 2, viewed: false }];
			root.state.notification.notifications = notifications;
			await root.dispatch(`${NotificationStore}/${NotificationActions.viewNotifications}`);
			expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
				type: 'viewNotifications',
				notificationIds: [2],
			});
		});
	});
});
