export const state = () => {
	return {
		items: [],
	};
};

export const getters = {
	items: state => Array.from(state.items).sort((a, b) => b.ts - a.ts),
};

export const FeedStore = 'feed';

export const FeedMutations = {
	addItem: 'addItem',
	itemLoaded: 'itemLoaded',
};

export const FeedActions = {
	receiveItem: 'receiveItem',
};

function suffix () {
	return Math.random().toString(36).slice(2);
}

function storeInSession (post) {
	sessionStorage.setItem(`${FeedStore}-${post.correlationId || post.guid}`, JSON.stringify(post));
}

export const mutations = {
	setItems: (state, payload) => {
		state.items = payload;
	},
	[FeedMutations.addItem]: (state, payload) => {
		state.items.unshift(payload);
		storeInSession(payload);
	},
	[FeedMutations.itemLoaded]: (state, payload) => {
		const item = state.items.find(i => i.correlationId === payload.correlationId);
		if (!item) {
			// was removed before load finish
			return;
		}
		if (payload.error) {
			item.error = payload.error;
			return;
		}
		item.guid = payload.guid;
		item.ts = payload.ts;
		delete item.correlationId;
	},
};

const INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP = Number.MAX_SAFE_INTEGER;

export const actions = {
	// TODO get all on init
	/* get: async (ctx) => {
		http fetch or websocket
	}, */
	saveItem: ({ rootState, commit }, payload) => {
		payload.error = null;
		payload.guid = null;
		payload.ts = INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP;
		payload.merchantId = rootState.merchant.id;
		payload.correlationId = `${Date.now()}${suffix()}`;
		commit(FeedMutations.addItem, payload);

		if (rootState.socket.isConnected) {
			// TODO? add some queue for sync after reconnect
			rootState.socket.$ws.sendObj(payload);
		}
	},
	[FeedActions.receiveItem]: ({ commit }, payload) => {
		if (!payload.correlationId) {
			// received from another user
			commit(FeedMutations.addItem, payload);
			return;
		}

		commit(FeedMutations.itemLoaded, payload);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
