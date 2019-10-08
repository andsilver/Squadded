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
	user: null,
});

export const UserMutations = {
	setMe: 'setMe',
	setOther: 'setOther',
	setToken: 'setToken',
};

export const mutations = {
	[UserMutations.setMe]: (state, me) => {
		state.me = new User(me);
	},
	[UserMutations.setOther]: (state, user) => {
		state.user = new User(user);
	},
	[UserMutations.setToken]: (state, token) => {
		localStorage.setItem('userToken', token);
		state.me.userId = getUserId(token);
	},
};

export default {
	mutations,
	namespaced: true,
	state,
};
