// import { FeedPost } from '../classes/FeedPost';

const CACHE_TIME_MINUTES = 5; // minutes
export const STORAGE_TOPOUTFITS_KEY = 'top-outfits';
export const ExploreStore = 'explore';

export const state = () => ({
	topOutfits: {
		ts: null,
		items: null,
	},
});

export const ExploreGetters = {
	getTopOutfits: 'getTopOutfits',
};

export const getters = {
	[ExploreGetters.getTopOutfits]: state => state.topOutfits.items,
};

export const ExploreMutations = {
	setTopOutfits: 'setTopOutfits',
};

export const mutations = {
	[ExploreMutations.setTopOutfits]: (state, outfits) => {
		const { items, ts } = outfits;
		if (+state.topOutfits.ts === +ts) {
			return;
		}
		state.topOutfits.items = items.filter(item => item.post.type === 'outfitPost');
		state.topOutfits.ts = +ts;
		sessionStorage.setItem(STORAGE_TOPOUTFITS_KEY, JSON.stringify(outfits));
	},
};

export const ExploreActions = {
	fetchTopOutfits: 'fetchTopOutfits',
};

export const actions = {
	[ExploreActions.fetchTopOutfits]: ({ rootState, commit }) => {
		let outfits = sessionStorage.getItem(STORAGE_TOPOUTFITS_KEY);

		try {
			outfits = JSON.parse(outfits);
		} catch (_) {
			outfits = null;
		}

		if (outfits && outfits.items && outfits.items.length) {
			const { ts } = outfits;
			if (Date.now() - +ts < CACHE_TIME_MINUTES * 60 * 1000) {
				commit(ExploreMutations.setTopOutfits, outfits);
				return;
			}
		}

		rootState.socket.$ws.sendObj({
			type: 'fetchTopOutfits',
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
