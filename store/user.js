import { User } from '~/classes/User';

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
		isMe: true,
		userId: getUserId(localStorage.getItem('userToken')),
	}),
	other: null,

});

export const UserMutations = {
	setFollow: 'setFollow',
	setMe: 'setMe',
	setOther: 'setOther',
	setToken: 'setToken',
};

export const mutations = {
	[UserMutations.setFollow]: (state, { follow, user }) => {
		if (user.isMe) {
			return;
		}
		user.followers.me = follow;
		const mod = (follow ? 1 : -1);
		user.followers.count = Math.max(0, user.followers.count + mod);
	},
	[UserMutations.setMe]: (state, me) => {
		state.me = new User({ ...me, isMe: true });
	},
	[UserMutations.setOther]: (state, user) => {
		state.other = new User(user);
	},
	[UserMutations.setUserList]: (state, users) => {
		state.userList = users.map(user => new User(user));
	},
	[UserMutations.setToken]: (state, token) => {
		localStorage.setItem('userToken', token);
		state.me.userId = getUserId(token);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
};
