import { FeedPost } from '../services/FeedPost';

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
	sessionStorage.setItem(`${FeedStore}-${post.guid}`, JSON.stringify(post.toStore()));
}

function removeFromSession (id) {
	sessionStorage.removeItem(`${FeedStore}-${id}`);
}

export const FeedMutations = {
	addComment: 'addComment',
	addItem: 'addItem',
	itemLoaded: 'itemLoaded',
	receiveComments: 'receiveComments',
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
		const post = state.items.find(i => i.guid === payload.guid || (i.correlationId && i.correlationId === payload.correlationId));
		if (!post) {
			// was removed before load finish
			return;
		}
		if (payload.error) {
			post.error = payload.error;
			return;
		}
		Object.assign(post, payload);
		removeFromSession(post.correlationId);
		post.unsetCorrelationId();
		storeInSession(post);
	},
	[FeedMutations.addComment]: (state, comment) => {
		const post = state.items.find(i => i.guid === comment.guid);
		if (!post) {
			return;
		}

		post.comments.push({
			author: {
				name: '',
				avatar: '',
			},
			ts: Date.now(),
			text: comment.text,
		});
	},
	[FeedMutations.receiveComments]: (state, msg) => {
		const post = state.items.find(i => i.guid === msg.guid);
		if (!post) {
			return;
		}

		post.comments = msg.comments;
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
	sendComment: 'sendComment',
	toggleLike: 'toggleLike',
	updateLike: 'updateLike',
};

export const actions = {
	// TODO get all on init
	/* get: async (ctx) => {
		http fetch or websocket
	}, */
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
		const post = new FeedPost({ ...payload, correlationId: `${Date.now()}${suffix()}` });

		dispatch(FeedActions.storeItem, post);
		if (rootState.socket.isConnected && rootState.socket.isAuth) {
			// TODO? add some queue for sync after reconnect
			rootState.socket.$ws.sendObj(post.toMessage());
		}
	},
	[FeedActions.sendComment]: ({ rootState, commit }, comment) => {
		rootState.socket.$ws.sendObj({
			type: 'addComment',
			...comment,
		});

		commit(FeedMutations.addComment, comment);
	},
	[FeedActions.receiveItem]: ({ state, commit, dispatch }, payload) => {
		const post = state.items.find(i => i.guid === payload.guid);
		if (!payload.correlationId && !post) {
			// received from another user
			const post = new FeedPost(payload);
			dispatch(FeedActions.storeItem, post);
			return;
		}

		commit(FeedMutations.itemLoaded, payload);
	},
	[FeedActions.toggleLike]: ({ commit, rootState }, post) => {
		if (!post.guid) {
			return;
		}

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
