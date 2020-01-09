import { postReported } from '~/utils/reportSession';

export const ActivityStore = 'activity';

export const state = () => ({
	blog: null,
	squadders: null,
	wishlist: null,
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
		state.squadders = state.squadders && state.squadders.filter(p => p.postId !== postId);
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
};

export const ActivityActions = {
	unwish: 'unwish',
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
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
