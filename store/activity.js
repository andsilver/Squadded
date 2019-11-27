import { FeedPost } from '~/classes/FeedPost';

export const ActivityStore = 'activity';

export const state = () => ({
	blog: null,
	squadders: null,
	wishlist: null,
});

export const ActivityGetters = {
	getPostById: 'getPostById',
	getWishByItemId: 'getWishByItemId',
};

export const getters = {
	[ActivityGetters.getPostById]: state => id => state.blog && state.blog.find(i => i.guid === id),
	[ActivityGetters.getWishByItemId]: state => id => state.wishlist && state.wishlist.find(post => post.isItemHasId(id)),
};

const isSameUser = (feed, userId) => (feed && feed.length && feed[0].userId === userId);

export const ActivityMutations = {
	addPost: 'addPost',
	removePost: 'removePost',
	removeWish: 'removeWish',
	clearWishlist: 'clearWishlist',
	clearBlog: 'clearBlog',
	setBlog: 'setBlog',
	setSquadders: 'setSquadders',
	setWishlist: 'setWishlist',
	unsquadd: 'unsquadd',
};

export const mutations = {
	[ActivityMutations.clearWishlist]: (state) => {
		state.wishlist = null;
	},
	[ActivityMutations.clearBlog]: (state) => {
		state.blog = null;
	},
	[ActivityMutations.setBlog]: (state, blog) => {
		state.blog = blog.map(post => new FeedPost(post));
	},
	[ActivityMutations.setSquadders]: (state, msg) => {
		state.squadders = msg.squadders.map(post => new FeedPost(post));
	},
	[ActivityMutations.setWishlist]: (state, wishlist) => {
		state.wishlist = wishlist.map(post => new FeedPost(post));
	},
	[ActivityMutations.addPost]: (state, post) => {
		if (isSameUser(state.blog, post.userId)) {
			state.blog.unshift(post);
		}
		if (isSameUser(state.wishlist, post.userId)) {
			state.wishlist.unshift(post);
		}
	},
	[ActivityMutations.removePost]: (state, postId) => {
		if (!postId) {
			return;
		}
		state.blog = state.blog && state.blog.filter(p => p.postId !== postId);
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
