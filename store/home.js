import { postReported } from '~/utils/reportSession';
import { LOADING_TIMEOUT } from '~/consts/time-values';

export const HomeStore = 'home';

export const state = () => ({
	posts: null,
	allLoaded: false,
	loading: false,
	loadedNew: false,
	watchers: [],
	public: [],
	interactions: [],
});

export const HomeMutations = {
	clearHome: 'clearHome',
	receive: 'receive',
	markAllLoaded: 'markAllLoaded',
	setLoading: 'setLoading',
	removePost: 'removePost',
	hidePopover: 'hidePopover',
};

export const mutations = {
	[HomeMutations.clearHome]: (state) => {
		state.posts = null;
		state.watchers = [];
		state.public = [];
		state.interactions = [];
		state.allLoaded = false;
		state.loadedNew = false;
	},
	[HomeMutations.receive]: (state, { posts, watchers, publicPosts, interactions }) => {
		state.posts = (state.posts || []).concat(posts.filter(p => !postReported(p)));
		state.watchers = state.watchers.concat(watchers);
		state.public = state.public.concat(publicPosts);
		state.interactions = state.interactions.concat(interactions);
	},
	[HomeMutations.removePost]: (state, postId) => {
		if (!postId) {
			return;
		}
		state.posts = state.posts && state.posts.filter(p => p.postId !== postId);
	},
	[HomeMutations.markAllLoaded]: (state, loadedPosts) => {
		if (loadedPosts.length === 0 && !state.loadedNew) {
			state.allLoaded = true;
		}
	},
	[HomeMutations.hidePopover]: (state) => {
		state.posts = (state.posts || []).map((post) => {
			post.user && (post.user.showPopover = false);
			return post;
		});
	},
	[HomeMutations.setLoading]: (state, loading) => {
		state.loading = loading;
	},
};

export const HomeActions = {
	fetch: 'fetch',
};

export const actions = {
	[HomeActions.fetch]: ({ rootState, commit }, loadNew) => {
		if (rootState.home.allLoaded || rootState.home.loading) {
			return;
		}
		const msg = {
			type: 'fetchHome',
		};
		const { watchers, public: publicPosts, interactions } = rootState.home;
		if (!loadNew) {
			rootState.home.loadedNew = false;
			watchers.length && (msg.watcherFrom = watchers[watchers.length - 1].ts);
			publicPosts.length && (msg.publicFrom = publicPosts[publicPosts.length - 1].ts);
			interactions.length && (msg.lastPost = interactions[interactions.length - 1].post.guid);
		} else {
			rootState.home.loadedNew = true;
		}
		rootState.socket.$ws.sendObj(msg);
		commit(HomeMutations.setLoading, true);
		setTimeout(() => commit(HomeMutations.setLoading, false), LOADING_TIMEOUT);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
