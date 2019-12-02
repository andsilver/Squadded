export const NotificationStore = 'notification';

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
};

const contain = state => ntf => state.notifications.find(n => ntf._id === n._id);

export const mutations = {
	[NotificationMutations.add]: (state, message) => {
		if (contain(state)(message)) {
			return;
		}
		message.viewed = message.viewed || false;
		state.notifications.unshift(message);
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
