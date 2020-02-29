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
	interactionPage: null,
});

export const HomeMutations = {
	clear: 'clear',
	receive: 'receive',
	markAllLoaded: 'markAllLoaded',
	setLoading: 'setLoading',
	removePost: 'removePost',
	hidePopover: 'hidePopover',
	follow: 'follow',
	setSquad: 'setSquad',
};

export const mutations = {
	[HomeMutations.clear]: (state) => {
		state.posts = null;
		state.watchers = [];
		state.public = [];
		state.interactions = [];
		state.allLoaded = false;
		state.loadedNew = false;
	},
	[HomeMutations.receive]: (state, { posts, watchers, publicPosts, interactions, interactionPage }) => {
		state.posts = (state.posts || []).concat(posts.filter(p => !postReported(p)));
		state.watchers = state.watchers.concat(watchers);
		state.public = state.public.concat(publicPosts);
		state.interactions = state.interactions.concat(interactions);
		state.interactionPage = interactionPage;
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
	[HomeMutations.follow]: (state, user) => {
		state.posts.forEach(p => (p.user.guid === user.guid && (p.user.followed = !p.user.followed)));
		state.posts = Object.assign([], state.posts);
	},
	[HomeMutations.setSquad]: (state, user) => {
		state.posts.forEach(p => (p.user.guid === user.guid && (p.user.mysquad = !p.user.mysquad)));
		state.posts = Object.assign([], state.posts);
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
		const { watchers, public: publicPosts, interactions, interactionPage } = rootState.home;
		if (!loadNew) {
			rootState.home.loadedNew = false;
			watchers.length && (msg.watcherFrom = watchers[watchers.length - 1].ts);
			publicPosts.length && (msg.publicFrom = publicPosts[publicPosts.length - 1].ts);
			if (interactions.length) {
				msg.interactLastPost = interactions[interactions.length - 1].post.guid;
				msg.interactLastPage = interactionPage;
			}
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
