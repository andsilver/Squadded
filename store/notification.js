export const NotificationStore = 'notification';
export const TIMEOUT = 5; // 5 seconds

export const state = () => ({
	notifications: [],
});

export const NotificationGetters = {
	notify: 'notify',
};

export const getters = {
	[NotificationGetters.notify]: state => state.notifications.filter(n => !n.viewed),
};

export const NotificationMutations = {
	add: 'add',
	viewAll: 'viewAll',
	receive: 'receive',
	view: 'view',
};

const contain = state => ntf => state.notifications.find(n => ntf._id === n._id);

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
		}, TIMEOUT * 1000);
		window.parent.postMessage(JSON.stringify({
			type: 'notification',
		}), '*');
		localStorage.setItem('notification', `${Date.now()}`);
	},
	[NotificationMutations.receive]: (state, notifications) => {
		const unique = notifications
			.filter(n => !contain(state)(n));
		unique.forEach((ntf) => {
			ntf.viewed = ntf.viewed || false;
		});
		state.notifications = [...unique, ...state.notifications];
	},
	[NotificationMutations.viewAll]: (state, list) => {
		state.notifications.forEach((ntf) => {
			ntf.viewed = true;
		});
		localStorage.removeItem('notification');
	},
	[NotificationMutations.view]: (state, notification) => {
		notification = state.notifications.find(n => n._id === notification._id);
		if (!notification) {
			return;
		}
		notification.viewed = true;
		notification.showBanner = false;
		if (!state.notifications.find(n => !n.viewed)) {
			localStorage.removeItem('notification');
		}
	},
};

export const NotificationActions = {
};

export const actions = {
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
