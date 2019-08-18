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
};

export const actions = {
	// TODO get all on init
	/* get: async (ctx) => {
		http fetch or websocket
	}, */
	saveItem: ({ commit }, payload) => {
		/* TODO
			pending status
			push to websocket
		*/
		commit('addItem', payload);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
