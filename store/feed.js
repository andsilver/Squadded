export const state = () => ({
	items: [],
	loading: true,
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

export const FeedMutations = {
	addBulk: 'addBulk',
	addItem: 'addItem',
	clear: 'clear',
	removePost: 'removePost',
};

export const mutations = {
	setItems: (state, payload) => {
		state.items = payload;
	},
	[FeedMutations.addBulk]: (state, newPosts) => {
		state.items = [...newPosts, ...state.items];
		state.loading = false;
	},
	[FeedMutations.addItem]: (state, post) => {
		state.items.unshift(post);
	},
	[FeedMutations.clear]: (state, payload) => {
		state.items = [];
		state.loading = true;
	},
	[FeedMutations.removePost]: (state, postId) => {
		if (!postId) {
			return;
		}
		state.items = state.items.filter(p => p.postId !== postId);
	},
};

export const FeedActions = {
	fetch: 'fetch',
};

export const actions = {
	[FeedActions.fetch]: ({ getters, rootState }) => {
		const msg = { type: 'fetchPosts' };
		const mostRecentPost = getters[FeedGetters.items][0];
		if (mostRecentPost) {
			msg.ts = mostRecentPost.ts;
		}
		state.loading = true;
		rootState.socket.$ws.sendObj(msg);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
