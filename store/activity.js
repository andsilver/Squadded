import { postReported } from '~/utils/reportSession';
import { LOADING_TIMEOUT } from '~/consts/time-values';

export const ActivityStore = 'activity';

export const state = () => ({
	blog: null,
	wishlist: null,
	allLoaded: {
		blog: false,
		wishlist: false,
	},
	guid: {
		blog: null,
		wishlist: null,
	},
	loadedNew: false,
	loading: {
		blog: false,
		wishlist: false,
	},
	isPrivate: false,
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
	clearWishlist: 'clearWishlist',
	clearBlog: 'clearBlog',
	setListOfType: 'setListOfType',
	unsquadd: 'unsquadd',
	markAllLoaded: 'markAllLoaded',
	setLoading: 'setLoading',
};

const exportWishlistToMerchant = (wishlist) => {
	window.parent.postMessage(JSON.stringify({
		type: 'wishlist',
		wishlist: wishlist.map(w => w.item.itemId),
	}), '*');
};

export const mutations = {
	[ActivityMutations.addPost]: (state, post) => {
		!state.blog && (state.blog = []);
		!state.wishlist && (state.wishlist = []);
		if (isSameUser(state.blog, post.userId)) {
			state.blog.unshift(post);
		}
		if (isSameUser(state.wishlist, post.userId)) {
			state.wishlist.unshift(post);
			exportWishlistToMerchant(state.wishlist);
		}
	},
	[ActivityMutations.clearWishlist]: (state) => {
		state.wishlist = null;
	},
	[ActivityMutations.clearBlog]: (state) => {
		state.blog = null;
	},
	[ActivityMutations.setListOfType]: (state, payload) => {
		const { posts, type, isMine } = payload;
		state[type] = posts.filter(p => !postReported(p));
		if (type === 'wishlist' && isMine) {
			exportWishlistToMerchant(posts);
		}
	},
	[ActivityMutations.removePost]: (state, postId) => {
		if (!postId) {
			return;
		}
		state.blog = state.blog && state.blog.filter(p => p.postId !== postId);
		state.wishlist = state.wishlist && state.wishlist.filter(p => p.postId !== postId);
	},
	[ActivityMutations.removeWish]: (state, wish) => {
		if (!wish) {
			return;
		}
		state.wishlist = (state.wishlist || []).filter(w => w !== wish);
		exportWishlistToMerchant(state.wishlist);
	},
	[ActivityMutations.unsquadd]: (state, itemId) => {
		if (!itemId) {
			return;
		}
		state.blog && state.blog.forEach((post, index) => {
			const item = post.getItem(itemId);
			if (item) {
				if (post.type === 'singleItemPost') {
					state.blog.splice(index, 1);
				} else {
					item.squadded = false;
				}
			}
		});
	},
	[ActivityMutations.markAllLoaded]: (state, { loadedPosts, type }) => {
		if (loadedPosts.length === 0 && !state.loadedNew) {
			state.allLoaded[type] = true;
		}
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
		const { itemId, varId, merchantId: itemMerchantId } = item;
		rootState.socket.$ws.sendObj({
			type: 'unwish',
			itemId,
			itemMerchantId,
			varId,
		});

		const wish = getters[ActivityGetters.getWishByItemId](itemId);
		if (wish && !rootState.activity.guid.wishlist) {
			commit(ActivityMutations.removeWish, wish);
		}

		commit(ActivityMutations.unsquadd, itemId);
	},
	[ActivityActions.fetchItems]: ({ rootState, commit }, { type, guid, loadNew, forMerchant }) => {
		const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
		if (guid !== rootState.activity.guid[type]) {
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
		if (type === 'wishlist' && !forMerchant) {
			msg.allMerchants = '*';
		}
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
