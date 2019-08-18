export const state = () => {
	return {
		items: [],
	};
};

export const getters = {
	items: state => state.items,
};

export const mutations = {
	setItems: (state, payload) => {
		state.items = payload;
	},
	addItem: (state, payload) => {
		state.items.push(payload);
	},
	itemLoaded: (state, payload) => {
		const item = state.items.find(i => i.id === payload.id);
		if (!item) {
			// was removed before load finish
			return;
		}
		item.guid = payload.guid;
	},
};

export const actions = {
	// TODO get all on init
	/* get: async (ctx) => {
		http fetch or websocket
	}, */
	saveItem: ({ rootState, commit }, payload) => {
		if (!rootState.socket.isConnected) {
			// TODO? add some queue for sync after reconnect
			return;
		}
		rootState.socket.$ws.sendObj(payload);

		payload.item.guid = null;
		commit('addItem', payload.item);
	},
	receiveItem: ({ commit }, payload) => {
		commit('itemLoaded', payload);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
