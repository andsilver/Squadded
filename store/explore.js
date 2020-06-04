const CACHE_TIME_MINUTES = 5; // minutes

export const STORAGE_KEYS = {
	topOutfits: 'top-outfits',
	topGallery: 'top-gallery',
	endingPolls: 'ending-polls',
	topItems: 'top-items',
};
export const ExploreStore = 'explore';

export const state = () => ({
	topOutfits: {
		ts: null,
		items: null,
	},
	topGallery: {
		ts: null,
		items: null,
	},
	endingPolls: {
		ts: null,
		items: null,
	},
	topItems: {
		ts: null,
		items: null,
	},
	friends: null,
	facebookFriends: [],
	searching: false,
});

export const ExploreGetters = {
	getItems: 'getItems',
};

export const getters = {
	[ExploreGetters.getItems]: state => type => state[type] && state[type].items,
};

export const ExploreMutations = {
	setItems: 'setItems',
	setFriends: 'setFriends',
	setSearching: 'setSearching',
	setInvited: 'setInvited',
	setFacebookFriends: 'setFacebookFriends',
};

export const mutations = {
	[ExploreMutations.setItems]: (state, { content, type }) => {
		const { items, ts } = content;

		if (state[type].ts === ts) {
			return;
		}
		state[type].items = items.filter(item => !!item);
		state[type].ts = ts;
	},
	[ExploreMutations.setFriends]: (state, friends) => {
		state.friends = friends;
	},
	[ExploreMutations.setFacebookFriends]: (state, friends) => {
		state.facebookFriends = (friends || []).map((f) => {
			const { miniAvatar, avatar } = f;

			if (!miniAvatar && avatar && avatar.includes('graph.facebook.com')) {
				const url = avatar.split('&width')[0];
				f.miniAvatar = url + '&width=60';
			}
			return f;
		});
	},
	[ExploreMutations.setSearching]: (state, searching) => {
		state.searching = searching;
	},
	[ExploreMutations.setInvited]: (state, userId) => {
		const friend = (state.friends || []).find(f => f.userId === userId);
		friend && (friend.invited = true);
	},
};

export const ExploreActions = {
	fetchItems: 'fetchItems',
	searchFriends: 'searchFriends',
};

export const actions = {
	[ExploreActions.fetchItems]: ({ rootState }, type) => {
		const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
		const { ts } = rootState.explore[type];

		if (ts && Date.now() - ts < CACHE_TIME_MINUTES * 60 * 1000) {
			return;
		}

		rootState.socket.$ws.sendObj({
			type: `fetch${capitalized}`,
		});
	},
	[ExploreActions.searchFriends]: ({ rootState, commit }, text) => {
		if (!text) {
			commit(ExploreMutations.setFriends, null);
			return;
		}
		if (text.length < 3) {
			return;
		}
		rootState.socket.$ws.sendObj({ type: 'searchUsers', text });
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
