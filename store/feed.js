import { storeInSession } from '~/utils/feedSession';
import { postReported } from '~/utils/reportSession';
import { LOADING_TIMEOUT } from '~/consts';
import { isMonoMerchant } from '~/utils/is-mono-merchant';
import { SquadAPI } from '~/services/SquadAPI';

const { FEED_STORE_LIMIT } = process.env;

export const state = () => ({
	items: null,
	loading: false,
	allLoaded: false,
	loadedNew: false,
	newPostsAvailable: true,
	squadders: null,
});

export const FeedGetters = {
	items: 'items',
	getPostById: 'getPostById',
};

export const getters = {
	[FeedGetters.items]: state => state.items && Array.from(state.items).sort((a, b) => b.ts - a.ts),
	[FeedGetters.getPostById]: state => id => (state.items || []).find(i => i.guid === id),
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
	setSquad: 'setSquad',
	unsquadd: 'unsquadd',
	reset: 'reset',
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
		!state.items && (state.items = []);
		state.items.unshift(post);
		storeInSession(post);
	},
	[FeedMutations.clear]: (state, payload) => {
		state.items = null;
		state.loading = false;
		state.allLoaded = false;
		state.loadedNew = false;
	},
	[FeedMutations.removePost]: (state, postId) => {
		if (!postId) {
			return;
		}
		state.items = (state.items || []).filter(p => p.postId !== postId);
	},
	[FeedMutations.markAllLoaded]: (state, loadedFeed) => {
		if (loadedFeed.length === 0 && !state.loadedNew) {
			state.allLoaded = true;
		}
	},
	[FeedMutations.setLoading]: (state, loading) => {
		state.loading = loading;
		if (!loading) {
			SquadAPI.rendered();
		}
	},
	[FeedMutations.receiveSquadders]: (state, squadders) => {
		state.squadders = squadders;
	},
	[FeedMutations.setNewPostsAvailable]: (state, flag) => {
		state.newPostsAvailable = flag;
	},
	[FeedMutations.setSquad]: (state, user) => {
		if (!state.items) {
			return;
		}
		state.items.forEach(p => (p.user.guid === user.guid && (p.user.mysquad = !p.user.mysquad)));
	},
	[FeedMutations.unsquadd]: (state, itemId) => {
		if (!state.items) {
			return;
		}
		state.items = state.items.filter((p) => {
			const item = p.getItem(itemId);
			if (!item) {
				return true;
			}
			if (p.type === 'singleItemPost' && p.byMe) {
				return false;
			}
			return true;
		});
	},
	[FeedMutations.reset]: (currentState) => {
		const initialState = state();
		Object.keys(currentState).forEach((key) => {
			currentState[key] = initialState[key];
		});
	},
};

export const FeedActions = {
	fetch: 'fetch',
};

export const actions = {
	[FeedActions.fetch]: ({ commit, getters, rootState }, loadNew = false) => {
		if (!loadNew && (rootState.feed.allLoaded || rootState.feed.loading)) {
			return;
		}
		rootState.feed.loading = true;
		const msg = { type: 'fetchPosts' };

		if (!isMonoMerchant(rootState)) {
			msg.allMerchants = '*';
		}
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
		setTimeout(() => {
			commit(FeedMutations.setLoading, false);
		}, LOADING_TIMEOUT);
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
