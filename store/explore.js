// import { FeedPost } from '../classes/FeedPost';

const CACHE_TIME_MINUTES = 5; // minutes
export const STORAGE_KEYS = {
	topOutfits: 'top-outfits',
	topGallery: 'top-gallery',
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
});

export const ExploreGetters = {
	getItems: 'getItems',
};

export const getters = {
	[ExploreGetters.getItems]: state => type => state[type] && state[type].items,
};

export const ExploreMutations = {
	setItems: 'setItems',
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
				}
			})
			.filter(item => !!item);
		state[type].ts = ts;
		sessionStorage.setItem(STORAGE_KEYS[type], JSON.stringify(content));
	},
};

export const ExploreActions = {
	fetchItems: 'fetchItems',
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
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
