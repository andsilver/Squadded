const { FEED_STORE_LIMIT } = process.env;

export const state = () => ({
	items: [],
});

export const FeedGetters = {
	items: 'items',
};

export const getters = {
	[FeedGetters.items]: state => Array.from(state.items).sort((a, b) => b.ts - a.ts),
};

export const FeedStore = 'feed';

function suffix () {
	return Math.random().toString(36).slice(2);
}

function storeInSession (post) {
	if (!post.guid) {
		return;
	}
	sessionStorage.setItem(`${FeedStore}-${post.guid}`, JSON.stringify(post));
}

function removeFromSession (id) {
	sessionStorage.removeItem(`${FeedStore}-${id}`);
}

export const FeedMutations = {
	addItem: 'addItem',
	itemLoaded: 'itemLoaded',
	restoreSession: 'restoreSession',
	setPostLike: 'setPostLike',
};

export const mutations = {
	setItems: (state, payload) => {
		state.items = payload;
	},
	[FeedMutations.addItem]: (state, payload) => {
		state.items.unshift(payload);
	},
	[FeedMutations.setPostLike]: (state, payload) => {
		const { post } = payload;
		if (payload.hasOwnProperty('byMe')) {
			post.likes.byMe = payload.byMe;
		}
		if (payload.hasOwnProperty('count')) {
			post.likes.count = payload.count;
		}
	},
	[FeedMutations.itemLoaded]: (state, payload) => {
		const item = state.items.find(i => i.guid === payload.guid || (i.correlationId && i.correlationId === payload.correlationId));
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
		removeFromSession(item.correlationId);
		delete item.correlationId;
		storeInSession(item);
	},
	[FeedMutations.restoreSession]: (state) => {
		if (state.items.length) {
			return;
		}
		const items = [];
		const { length } = sessionStorage;
		for (let i = 0; i < length; i++) {
			const key = sessionStorage.key(i);
			if (!key.startsWith(FeedStore)) {
				continue;
			}
			items.push(JSON.parse(sessionStorage.getItem(key)));
		}
		items.sort((a, b) => b.ts - a.ts);
		state.items = items;
	},
};

const INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP = Number.MAX_SAFE_INTEGER;

export const FeedActions = {
	storeItem: 'storeItem',
	receiveItem: 'receiveItem',
	saveItem: 'saveItem',
	toggleLike: 'toggleLike',
	updateLike: 'updateLike',
};

export const actions = {
	// TODO get all on init
	/* get: async (ctx) => {
		http fetch or websocket
	}, */
	[FeedActions.storeItem]: ({ getters, commit }, payload) => {
		commit(FeedMutations.addItem, payload);
		if (getters.items.length > FEED_STORE_LIMIT) {
			const overflowItem = getters.items[FEED_STORE_LIMIT];
			const overflowId = overflowItem.correlationId || overflowItem.guid;
			removeFromSession(overflowId);
		}
		storeInSession(payload);
	},
	[FeedActions.saveItem]: ({ rootState, dispatch }, payload) => {
		payload.likes = {};
		payload.error = null;
		payload.guid = null;
		payload.ts = INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP;
		payload.correlationId = `${Date.now()}${suffix()}`;
		dispatch(FeedActions.storeItem, payload);

		if (rootState.socket.isConnected && rootState.socket.isAuth) {
			// TODO? add some queue for sync after reconnect
			const { guid, ...clean } = payload;
			rootState.socket.$ws.sendObj(clean);
		}
	},
	[FeedActions.receiveItem]: ({ state, commit, dispatch }, payload) => {
		const post = state.items.find(i => i.guid === payload.guid);
		if (!payload.correlationId && !post) {
			// received from another user
			dispatch(FeedActions.storeItem, payload);
			return;
		}

		commit(FeedMutations.itemLoaded, payload);
	},
	[FeedActions.toggleLike]: ({ commit, rootState }, post) => {
		const byMe = !post.likes.byMe;
		commit(FeedMutations.setPostLike, {
			post,
			count: post.likes.count + (byMe ? 1 : -1),
			byMe,
		});
		rootState.socket.$ws.sendObj({
			type: 'like',
			guid: post.guid,
			iLike: byMe,
		});
		storeInSession(post);
	},
	[FeedActions.updateLike]: ({ commit, state }, payload) => {
		const post = state.items.find(i => i.guid === payload.guid);
		commit(FeedMutations.setPostLike, {
			post,
			...payload.likes,
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
