import { FeedPost } from '../classes/FeedPost';

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

export const FeedMutations = {
	addBulk: 'addBulk',
	addItem: 'addItem',
	clear: 'clear',
	itemLoaded: 'itemLoaded',
};

export const mutations = {
	setItems: (state, payload) => {
		state.items = payload;
	},
	[FeedMutations.addBulk]: (state, newPosts) => {
		state.items = [...newPosts, ...state.items];
	},
	[FeedMutations.addItem]: (state, payload) => {
		state.items.unshift(payload);
	},
	[FeedMutations.clear]: (state, payload) => {
		state.items = [];
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
		post.unsetCorrelationId();
	},
};

export const FeedActions = {
	receiveBulk: 'receiveBulk',
	receiveItem: 'receiveItem',
	reSquaddItem: 'reSquaddItem',
	saveItem: 'saveItem',
};

export const actions = {
	[FeedActions.fetch]: ({ getters, rootState }) => {
		const msg = { type: 'fetchPosts' };
		const mostRecentPost = getters[FeedGetters.items][0];
		if (mostRecentPost) {
			msg.ts = mostRecentPost.ts;
		}
		rootState.socket.$ws.sendObj(msg);
	},
	[FeedActions.saveItem]: ({ rootState, commit }, payload) => {
		const post = new FeedPost({
			...payload,
			byMe: true,
			correlationId: `${Date.now()}${suffix()}`,
			user: rootState.user.me.short(),
		});

		commit(FeedMutations.addItem, post);
		if (rootState.socket.isConnected && rootState.socket.isAuth) {
			// TODO? add some queue for sync after reconnect
			rootState.socket.$ws.sendObj(post.toMessage());
		}
		return post;
	},
	[FeedActions.reSquaddItem]: ({ rootState, commit }, payload) => {
		const post = new FeedPost({
			...payload,
			byMe: true,
			type: 'singleItemPost',
			correlationId: `${Date.now()}${suffix()}`,
			user: rootState.user.me.short(),
		});

		commit(FeedMutations.addItem, post);
		if (rootState.socket.isConnected && rootState.socket.isAuth) {
			// TODO? add some queue for sync after reconnect
			rootState.socket.$ws.sendObj(post.toMessage());
		}
	},
	[FeedActions.receiveBulk]: ({ commit, getters }, feed) => {
		const newPosts = [];
		feed.forEach((rawPost) => {
			const post = getters[FeedGetters.getPostById](rawPost.guid);
			if (!post) {
				newPosts.push(new FeedPost(rawPost));
				return;
			}
			// just in case it is exit in a feed
			commit(FeedMutations.itemLoaded, rawPost);
		});
		commit(FeedMutations.addBulk, newPosts);
	},
	[FeedActions.receiveItem]: ({ commit, getters }, payload) => {
		const post = getters[FeedGetters.getPostById](payload.guid);

		if (!payload.correlationId && !post) {
			// received from another user
			const post = new FeedPost(payload);
			commit(FeedMutations.addItem, post);

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
