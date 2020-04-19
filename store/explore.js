import { FeedPost } from '~/classes/FeedPost';

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
		state[type].items = items
			.map((item) => {
				if (type === 'topOutfits') {
					return item.post.type === 'outfitPost' ? item : null;
				} else if (type === 'topGallery') {
					return item.post.type === 'galleryPost' ? item : null;
				} else {
					item.postId = item._id;
					return new FeedPost(item);
				}
			})
			.filter(item => !!item);
		state[type].ts = ts;
		sessionStorage.setItem(STORAGE_KEYS[type], JSON.stringify(content));
	},
	[ExploreMutations.setFriends]: (state, friends) => {
		state.friends = friends;
	},
	[ExploreMutations.setFacebookFriends]: (state, friends) => {
		state.facebookFriends = (friends || []).map(f => ({
			...f,
			avatar: `https://graph.facebook.com/${f.id}/picture?type=square&width=60`,
		}));
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
	[ExploreActions.fetchItems]: ({ rootState, commit }, type) => {
		const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
		let saved = sessionStorage.getItem(STORAGE_KEYS[type]);

		try {
			saved = JSON.parse(saved);
		} catch (_) {
			saved = null;
		}

		if (saved && saved.items && saved.items.length) {
			const { ts } = saved;
			if ((Date.now() - ts) < CACHE_TIME_MINUTES * 60 * 1000) {
				commit(ExploreMutations.setItems, { content: saved, type });
				return;
			}
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
