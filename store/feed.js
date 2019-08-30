export const state = () => {
	return {
		items: [],
	};
};

export const getters = {
	items: state => Array.from(state.items).sort((a, b) => b.ts - a.ts),
};

export const mutations = {
	setItems: (state, payload) => {
		state.items = payload;
	},
	addItem: (state, payload) => {
		state.items.unshift(payload);
	},
	itemLoaded: (state, payload) => {
		const item = state.items.find(i => payload.correlationId && i.correlationId === payload.correlationId);
		if (!item) {
			// was removed before load finish
			// or received from another user
			state.items.unshift(payload);
			return;
		}
		item.guid = payload.guid;
		item.ts = payload.ts;
		delete item.correlationId;
	},
};

function suffix () {
	return Math.random().toString(36).slice(2);
}

const INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP = Number.MAX_SAFE_INTEGER;

export const actions = {
	// TODO get all on init
	/* get: async (ctx) => {
		http fetch or websocket
	}, */
	saveItem: ({ rootState, commit }, payload) => {
		payload.guid = null;
		payload.ts = INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP;
		payload.correlationId = `${Date.now()}${suffix()}`;
		commit('addItem', payload);

		if (rootState.socket.isConnected) {
			// TODO? add some queue for sync after reconnect
			rootState.socket.$ws.sendObj(payload);
		}
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
