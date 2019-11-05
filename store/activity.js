import { FeedPost } from '~/classes/FeedPost';

export const ActivityStore = 'activity';

export const state = () => ({
	blog: null,
	wishlist: null,
});

export const ActivityMutations = {
	setBlog: 'setBlog',
	setWishlist: 'setWishlist',
};

export const mutations = {
	[ActivityMutations.setWishlist]: (state, msg) => {
		state.wishlist = msg.wishlist.map(post => new FeedPost(post));
	},
	[ActivityMutations.setBlog]: (state, msg) => {
		state.blog = msg.blog.map(post => new FeedPost(post));
	},
};

export default {
	namespaced: true,
	state,
	mutations,
};