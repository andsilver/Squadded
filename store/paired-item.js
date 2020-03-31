import { FeedPost } from '../classes/FeedPost';
import { postReported } from '~/utils/reportSession';

export const PairedItemStore = 'pairedItem';

export const state = () => ({
	item: null,
	allPosts: [],
	hesitatingUsers: [],
});

export const PairedItemGetters = {
	getItem: 'getItem',
	getAllPosts: 'getAllPosts',
	getOutfitPosts: 'getOutfitPosts',
	getPollPosts: 'getPollPosts',
	getGalleryPosts: 'getGalleryPosts',
};

const getPostsByType = (posts, type) => posts.filter(post => post.type === type);

export const getters = {
	[PairedItemGetters.getItem]: state => state.item,
	[PairedItemGetters.getAllPosts]: state => state.allPosts,
	[PairedItemGetters.getOutfitPosts]: state => getPostsByType(state.allPosts, 'outfitPost'),
	[PairedItemGetters.getPollPosts]: state => getPostsByType(state.allPosts, 'pollPost'),
	[PairedItemGetters.getGalleryPosts]: state => getPostsByType(state.allPosts, 'galleryPost'),
};

export const PairedItemMutations = {
	setItem: 'setItem',
	setAllPosts: 'setAllPosts',
	setHesitatingUsers: 'setHesitatingUsers',
	resquad: 'resquad',
	unsquadd: 'unsquadd',
	removePost: 'removePost',
};

export const mutations = {
	[PairedItemMutations.setItem]: (state, item) => {
		state.item = item;
	},
	[PairedItemMutations.setAllPosts]: (state, allPosts) => {
		state.allPosts = (allPosts || []).map(post => new FeedPost(post)).filter(p => !postReported(p));
	},
	[PairedItemMutations.setHesitatingUsers]: (state, hesitatingUsers) => {
		state.hesitatingUsers = hesitatingUsers || [];
	},
	[PairedItemMutations.unsquadd]: (state, itemId) => {
		if (!itemId || !state.item) {
			return;
		}
		state.item.squadded = false;
		state.allPosts.forEach((post) => {
			const item = post.getItem(itemId);
			item && (item.squadded = false);
		});
	},
	[PairedItemMutations.resquad]: (state, itemId) => {
		if (!itemId || !state.item) {
			return;
		}
		state.item.squadded = true;
	},
	[PairedItemMutations.removePost]: (state, postId) => {
		if (!postId) {
			return;
		}
		state.allPosts = state.allPosts.filter(p => p.postId !== postId);
	},
};

export const PairedItemActions = {
	initPairedItem: 'initPairedItem',
	setPairedItem: 'setPairedItem',
	reSquaddItem: 'reSquaddItem',
};

export const actions = {
	[PairedItemActions.initPairedItem]: ({ rootState, commit }, { varId, itemId, postId }) => {
		commit(PairedItemMutations.setItem, null);
		commit(PairedItemMutations.setAllPosts, []);
		commit(PairedItemMutations.setHesitatingUsers, []);
		rootState.socket.$ws.sendObj({
			type: 'fetchItem',
			varId,
			itemId: `${itemId}`,
			postId,
		});
	},
	[PairedItemActions.setPairedItem]: ({ commit }, { item, allPosts, hesitatingUsers }) => {
		commit(PairedItemMutations.setItem, item);
		commit(PairedItemMutations.setAllPosts, allPosts);
		commit(PairedItemMutations.setHesitatingUsers, hesitatingUsers);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
