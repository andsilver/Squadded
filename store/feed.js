import { FeedPost } from '../services/FeedPost';

const { FEED_STORE_LIMIT } = process.env;

export const state = () => ({
	items: [],
});

export const FeedGetters = {
	items: 'items',
	getPostById: 'getPostById',
};

export const getters = {
	[FeedGetters.items]: state => Array.from(state.items).sort((a, b) => b.ts - a.ts),
	[FeedGetters.getPostById]: state => id => state.items.find(i => i.guid === id),
};

export const FeedStore = 'feed';

function suffix () {
	return Math.random().toString(36).slice(2);
}

function storeInSession (post) {
	if (!post.guid) {
		return;
	}
	sessionStorage.setItem(`${FeedStore}-${post.guid}`, JSON.stringify(post.toStore()));
}

function removeFromSession (id) {
	sessionStorage.removeItem(`${FeedStore}-${id}`);
}

export const FeedMutations = {
	addItem: 'addItem',
	itemLoaded: 'itemLoaded',
	restoreSession: 'restoreSession',
};

export const mutations = {
	setItems: (state, payload) => {
		state.items = payload;
	},
	[FeedMutations.addItem]: (state, payload) => {
		state.items.unshift(payload);
	},
	[FeedMutations.itemLoaded]: (state, payload) => {
		const post = state.items.find(i => i.guid === payload.guid || (i.correlationId && i.correlationId === payload.correlationId));
		if (!post) {
			// was removed before load finish
			return;
		}
		if (payload.error) {
			post.error = payload.error;
			return;
		}
		post.update(payload);
		removeFromSession(post.correlationId);
		post.unsetCorrelationId();
		storeInSession(post);
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
			const post = new FeedPost(JSON.parse(sessionStorage.getItem(key)));
			items.push(post);
		}
		items.sort((a, b) => b.ts - a.ts);
		state.items = items;
	},
};

export const FeedActions = {
	storeItem: 'storeItem',
	receiveItem: 'receiveItem',
	saveItem: 'saveItem',
};

export const actions = {
	[FeedActions.storeItem]: ({ getters, commit }, post) => {
		commit(FeedMutations.addItem, post);
		if (getters.items.length > FEED_STORE_LIMIT) {
			const overflowItem = getters.items[FEED_STORE_LIMIT];
			const overflowId = overflowItem.correlationId || overflowItem.guid;
			removeFromSession(overflowId);
		}
		storeInSession(post);
	},
	[FeedActions.saveItem]: ({ rootState, dispatch }, payload) => {
		const post = new FeedPost({
			...payload,
			correlationId: `${Date.now()}${suffix()}`,
			user: rootState.user.me.short(),
		});

		dispatch(FeedActions.storeItem, post);
		if (rootState.socket.isConnected && rootState.socket.isAuth) {
			// TODO? add some queue for sync after reconnect
			rootState.socket.$ws.sendObj(post.toMessage());
		}
	},
	[FeedActions.receiveItem]: ({ commit, dispatch, getters }, payload) => {
		const post = getters[FeedGetters.getPostById](payload.guid);
		if (!payload.correlationId && !post) {
			// received from another user
			const post = new FeedPost(payload);
			dispatch(FeedActions.storeItem, post);
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
