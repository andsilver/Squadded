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

const me = new User({
	isMe: true,
	userId: getUserId(localStorage.getItem('userToken')),
});

export const state = () => ({
	all: [me],
	me,
	other: null,
});

export const UserGetters = {
	getUserById: 'getUserById',
};

export const getters = {
	[UserGetters.getUserById]: state => id => state.all.find(u => u.userId === id),
};

export const UserMutations = {
	setFollow: 'setFollow',
	setMe: 'setMe',
	setOther: 'setOther',
	setUserList: 'setUserList',
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
		state.me.following.count = Math.max(0, state.me.following.count + mod);
	},
	[UserMutations.setMe]: (state, me) => {
		const newAll = state.all.filter(u => u !== state.me);
		state.me = new User({ ...me, isMe: true });
		newAll.push(state.me);
		state.all = newAll;
	},
	[UserMutations.setOther]: (state, user) => {
		const newAll = state.all.filter(u => u !== state.other);
		state.other = new User(user);
		newAll.push(state.other);
		state.all = newAll;
	},
	[UserMutations.setUserList]: (state, users) => {
		state.userList = users.map(user => new User(user));
	},
	[UserMutations.setToken]: (state, token) => {
		localStorage.setItem('userToken', token);
		state.me.userId = getUserId(token);
	},
};

export const UserActions = {
	setProfile: 'setProfile',
};

export const actions = {
	[UserActions.setProfile]: ({ rootState, commit }, user) => {
		commit(UserMutations.setMe, user);
		rootState.socket.$ws.sendObj({
			type: 'setProfile',
			user: {
				bio: user.bio,
				private: user.private,
				name: user.name,
			},
		});
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
