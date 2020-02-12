import { storeInSession } from '~/utils/feedSession';
import { postReported } from '~/utils/reportSession';

const { FEED_STORE_LIMIT } = process.env;

export const state = () => ({
	items: [],
	loading: false,
	allLoaded: false,
	loadedNew: false,
	newPostsAvailable: true,
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
	addItem: 'addItem',
	clear: 'clear',
	removePost: 'removePost',
	setItems: 'setItems',
	markAllLoaded: 'markAllLoaded',
	setLoading: 'setLoading',
	receiveSquadders: 'receiveSquadders',
	setNewPostsAvailable: 'setNewPostsAvailable',
};

export const mutations = {
	[FeedMutations.setItems]: (state, posts) => {
		state.items = posts.filter(p => !postReported(p));
		state.items
			.sort((a, b) => b.ts - a.ts)
			.slice(0, FEED_STORE_LIMIT)
			.forEach(storeInSession);
	},
	[FeedMutations.addItem]: (state, post) => {
		state.items.unshift(post);
		storeInSession(post);
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
	[FeedMutations.markAllLoaded]: (state, loadedFeed) => {
		if (loadedFeed.length === 0 && !state.loadedNew) {
			state.allLoaded = true;
		}
	},
	[FeedMutations.setLoading]: (state, loading) => {
		state.loading = loading;
	},
	[FeedMutations.receiveSquadders]: () => {},
	[FeedMutations.setNewPostsAvailable]: (state, flag) => {
		state.newPostsAvailable = flag;
	},
};

export const FeedActions = {
	fetch: 'fetch',
};

export const actions = {
	[FeedActions.fetch]: ({ commit, getters, rootState }, loadNew = false) => {
		if (rootState.feed.allLoaded || rootState.feed.loading) {
			return;
		}
		rootState.feed.loading = true;
		const msg = { type: 'fetchPosts' };
		const items = getters[FeedGetters.items];
		if (loadNew || !items || !items.length) {
			rootState.feed.loadedNew = true;
			commit(FeedMutations.setNewPostsAvailable, false);
		} else {
			const mostRecentPost = items[items.length - 1];
			if (mostRecentPost) {
				msg.from = mostRecentPost.ts;
			}
			rootState.feed.loadedNew = false;
		}
		commit(FeedMutations.setLoading, true);
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
