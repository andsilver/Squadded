import { User } from '~/services/User';

export const UserStore = 'user';

function getUserId(token) {
	if (!token) {
		return null;
	}
	const payload = token.split('.')[1];
	const data = JSON.parse(atob(payload));
	return data.sub;
}

export const state = () => ({
	me: new User({
		userId: getUserId(localStorage.getItem('userToken')),
	}),
	other: null,
});

export const UserGetters = {
	getPostById: 'getPostById',
};

export const getters = {
	[UserGetters.getPostById]: state => id => state.me.blog.find(i => i.guid === id),
};

export const UserMutations = {
	setBlog: 'setBlog',
	setFollow: 'setFollow',
	setMe: 'setMe',
	setOther: 'setOther',
	setToken: 'setToken',
	setWishlist: 'setWishlist',
};

export const mutations = {
	[UserMutations.setFollow]: (state, { follow, other }) => {
		if (!other) {
			return;
		}
		other.followers.me = follow;
		const mod = (follow ? 1 : -1);
		other.followers.count = Math.max(0, other.followers.count + mod);
	},
	[UserMutations.setMe]: (state, me) => {
		state.me = new User(me);
	},
	[UserMutations.setOther]: (state, user) => {
		state.other = new User(user);
	},
	[UserMutations.setToken]: (state, token) => {
		localStorage.setItem('userToken', token);
		state.me.userId = getUserId(token);
	},
	[UserMutations.setWishlist]: (state, msg) => {
		if (state.me.userId === msg.userId) {
			state.me.wishlist = msg.wishlist;
			return;
		}
		state.other.wishlist = msg.wishlist;
	},
	[UserMutations.setBlog]: (state, msg) => {
		if (state.me.userId === msg.userId) {
			state.me.blog = msg.blog;
			return;
		}
		state.other.blog = msg.blog;
	},
};

export default {
	getters,
	mutations,
	namespaced: true,
	state,
};
