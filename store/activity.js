import { FeedPost } from '~/classes/FeedPost';

export const ActivityStore = 'activity';

export const state = () => ({
	blog: null,
	squadders: null,
	wishlist: null,
});

export const ActivityGetters = {
	getPostById: 'getPostById',
};

export const getters = {
	[ActivityGetters.getPostById]: state => id => state.blog.find(i => i.guid === id),
};

const isSameUser = (feed, userId) => (feed && feed.length && feed[0].userId === userId);

export const ActivityMutations = {
	addPost: 'addPost',
	setBlog: 'setBlog',
	setWishlist: 'setWishlist',
};

export const mutations = {
	[ActivityMutations.setBlog]: (state, msg) => {
		state.blog = msg.blog.map(post => new FeedPost(post));
	},
	[ActivityMutations.setSquadders]: (state, msg) => {
		state.squadders = msg.squadders.map(post => new FeedPost(post));
	},
	[ActivityMutations.setWishlist]: (state, msg) => {
		state.wishlist = msg.wishlist.map(post => new FeedPost(post));
	},
	[ActivityMutations.addPost]: (state, post) => {
		if (isSameUser(state.blog, post.userId)) {
			state.blog.unshift(post);
		}
		if (isSameUser(state.wishlist, post.userId)) {
			state.wishlist.unshift(post);
		}
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
};
