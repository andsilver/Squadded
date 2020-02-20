export const NotificationStore = 'notification';
export const TIMEOUT_SECONDS = 5; // 5 seconds
export const STORAGE_NOTIFICATIONS_KEY = 'notifications';
export const CACHE_TIME_MINUTES = 5; // minutes

export const state = () => ({
	notifications: [],
});

export const NotificationGetters = {
	notify: 'notify',
	newNotify: 'newNotify',
	oldNotify: 'oldNotify',
};

export const getters = {
	[NotificationGetters.notify]: state => state.notifications.filter(n => !n.viewed),
	[NotificationGetters.newNotify]: state => state.notifications.filter(n => !n.viewed),
	[NotificationGetters.oldNotify]: state => state.notifications.filter(n => n.viewed),
};

export const NotificationMutations = {
	add: 'add',
	viewAll: 'viewAll',
	receive: 'receive',
	view: 'view',
	setAcceptedSquad: 'setAcceptedSquad',
};

const contain = state => ntf => state.notifications.find(n => ntf._id === n._id);
const unreadExist = state => state.notifications.find(n => !n.viewed);

export const mutations = {
	[NotificationMutations.add]: (state, message) => {
		if (contain(state)(message)) {
			return;
		}
		message.viewed = message.viewed || false;
		message.showBanner = true;
		state.notifications.unshift(message);
		setTimeout(() => {
			message.showBanner = false;
		}, TIMEOUT_SECONDS * 1000);
		window.parent.postMessage(JSON.stringify({
			type: 'notification',
			message,
		}), '*');
	},
	[NotificationMutations.receive]: (state, { notifications, ts }) => {
		const unique = notifications.filter(n => !contain(state)(n));
		unique.forEach(ntf => (ntf.viewed = ntf.viewed || false));
		state.notifications = [...unique, ...state.notifications];
		sessionStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify({
			items: state.notifications,
			ts: ts || Date.now(),
		}));
		if (unreadExist(state)) {
			window.parent.postMessage(JSON.stringify({
				type: 'notification',
			}), '*');
		}
	},
	[NotificationMutations.viewAll]: (state, list) => {
		state.notifications.forEach((ntf) => {
			ntf.viewed = true;
		});
		sessionStorage.removeItem(STORAGE_NOTIFICATIONS_KEY);
	},
	[NotificationMutations.view]: (state, notification) => {
		notification = state.notifications.find(n => n._id === notification._id);
		if (!notification) {
			return;
		}
		notification.viewed = true;
		notification.showBanner = false;
	},
	[NotificationMutations.setAcceptedSquad]: (state, id) => {
		const notification = state.notifications.find(n => n._id === id);
		if (!notification) {
			return;
		}
		notification.accepted = true;
	},
};

export const NotificationActions = {
	fetchNotifications: 'fetchNotifications',
	viewNotifications: 'viewNotifications',
};

export const actions = {
	[NotificationActions.fetchNotifications]: ({ rootState, commit }) => {
		let notifications = sessionStorage.getItem(STORAGE_NOTIFICATIONS_KEY);

		try {
			notifications = JSON.parse(notifications);
		} catch (_) {
			notifications = null;
		}

		if (notifications) {
			const { ts, items } = notifications;
			if (Date.now() - +ts < CACHE_TIME_MINUTES * 60 * 1000 && items.length) {
				commit(NotificationMutations.receive, { notifications: items, ts });
				return;
			}
		}

		rootState.socket.$ws.sendObj({
			type: 'fetchNotifications',
		});
	},
	[NotificationActions.viewNotifications]: ({ rootState, commit }) => {
		const notificationIds = getters[NotificationGetters.newNotify](rootState.notification).map(n => n._id);
		commit(NotificationMutations.viewAll);
		rootState.socket.$ws.sendObj({
			type: 'viewNotifications',
			notificationIds,
		});
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
