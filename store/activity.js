import { postReported } from '~/utils/reportSession';
import { LOADING_TIMEOUT } from '~/consts/time-values';

export const ActivityStore = 'activity';

export const state = () => ({
	blog: null,
	community: null,
	wishlist: null,
	allLoaded: {
		blog: false,
		wishlist: false,
		community: false,
	},
	guid: {
		blog: null,
		wishlist: null,
	},
	loading: {
		community: false,
	},
	loadedNew: false,
});

export const ActivityGetters = {
	getPostById: 'getPostById',
	getWishByItemId: 'getWishByItemId',
	getSelected: 'getSelected',
};

export const getters = {
	[ActivityGetters.getSelected]: state => (state.wishlist || []).filter(post => post.selected),
	[ActivityGetters.getPostById]: state => id => state.blog && state.blog.find(i => i.guid === id),
	[ActivityGetters.getWishByItemId]: state => id => state.wishlist && state.wishlist.find(post => post.getItem(id)),
};

const isSameUser = (feed, userId) => (feed && feed.length && feed[0].userId === userId);

export const ActivityMutations = {
	addPost: 'addPost',
	removePost: 'removePost',
	removeWish: 'removeWish',
	clearCommunity: 'clearCommunity',
	clearWishlist: 'clearWishlist',
	clearBlog: 'clearBlog',
	setListOfType: 'setListOfType',
	unsquadd: 'unsquadd',
	markAllLoaded: 'markAllLoaded',
	hidePopover: 'hidePopover',
	setLoading: 'setLoading',
};

export const mutations = {
	[ActivityMutations.addPost]: (state, post) => {
		if (isSameUser(state.blog, post.userId)) {
			state.blog.unshift(post);
		}
		if (isSameUser(state.wishlist, post.userId)) {
			state.wishlist.unshift(post);
		}
	},
	[ActivityMutations.clearCommunity]: (state) => {
		state.community = null;
		state.allLoaded.community = false;
		state.loadedNew = false;
	},
	[ActivityMutations.clearWishlist]: (state) => {
		state.wishlist = null;
	},
	[ActivityMutations.clearBlog]: (state) => {
		state.blog = null;
	},
	[ActivityMutations.setListOfType]: (state, payload) => {
		const { posts, type } = payload;
		state[type] = posts.filter(p => !postReported(p));
	},
	[ActivityMutations.removePost]: (state, postId) => {
		if (!postId) {
			return;
		}
		state.blog = state.blog && state.blog.filter(p => p.postId !== postId);
		state.community = state.community && state.community.filter(p => p.postId !== postId);
		state.wishlist = state.wishlist && state.wishlist.filter(p => p.postId !== postId);
	},
	[ActivityMutations.removeWish]: (state, wish) => {
		if (!wish) {
			return;
		}
		state.wishlist = state.wishlist.filter(w => w !== wish);
	},
	[ActivityMutations.unsquadd]: (state, itemId) => {
		if (!itemId) {
			return;
		}
		state.blog && state.blog.forEach((post) => {
			const item = post.getItem(itemId);
			item && (item.squadded = false);
		});
	},
	[ActivityMutations.markAllLoaded]: (state, { loadedPosts, type }) => {
		if (loadedPosts.length === 0 && !state.loadedNew) {
			state.allLoaded[type] = true;
		}
	},
	[ActivityMutations.hidePopover]: (state) => {
		state.community = (state.community || []).map((post) => {
			post.user && (post.user.showPopover = false);
			return post;
		});
	},
	[ActivityMutations.setLoading]: (state, { type, loading }) => {
		state.loading[type] = loading;
	},
};

export const ActivityActions = {
	unwish: 'unwish',
	fetchItems: 'fetchItems',
};

export const actions = {
	[ActivityActions.unwish]: ({ commit, getters, rootState }, item) => {
		const { itemId } = item;
		rootState.socket.$ws.sendObj({
			type: 'unwish',
			itemId,
		});

		const wish = getters[ActivityGetters.getWishByItemId](itemId);
		if (wish) {
			commit(ActivityMutations.removeWish, wish);
		}

		commit(ActivityMutations.unsquadd, itemId);
	},
	[ActivityActions.fetchItems]: ({ rootState, commit }, { type, guid, loadNew }) => {
		const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
		if (type !== 'community' && guid !== rootState.activity.guid[type]) {
			commit(ActivityMutations[`clear${capitalized}`]);
			rootState.activity.guid[type] = guid;
			rootState.activity.allLoaded[type] = false;
		}
		if (rootState.activity.allLoaded[type]) {
			return;
		}
		const items = rootState.activity[type];
		const mostRecent = items && items.length && items[items.length - 1];
		const msg = {
			type: `fetch${capitalized}`,
		};
		if (!loadNew) {
			mostRecent && (msg.from = mostRecent.ts);
			rootState.activity.loadedNew = false;
		} else {
			rootState.activity.loadedNew = true;
		}
		guid && (msg.guid = guid);
		rootState.socket.$ws.sendObj(msg);
		commit(ActivityMutations.setLoading, { type, loading: true });
		setTimeout(() => commit(ActivityMutations.setLoading, { type, loading: false }), LOADING_TIMEOUT);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
