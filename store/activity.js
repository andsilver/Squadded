import { postReported } from '~/utils/reportSession';
import { LOADING_TIMEOUT, WISHLIST_LOADED } from '~/consts';
import { isMonoMerchant } from '~/utils/is-mono-merchant';

export const ActivityStore = 'activity';

export const state = () => ({
	blog: null,
	wishlist: null,
	allLoaded: {
		blog: false,
		wishlist: false,
	},
	guid: {
		blog: null,
		wishlist: null,
	},
	loadedNew: false,
	loading: {
		blog: false,
		wishlist: false,
	},
	isPrivate: false,
	myWishlist: [],
	lastItems: {
		items: [],
		ts: null,
	},
	selected: [],
});

export const ActivityGetters = {
	getPostById: 'getPostById',
	getWishByItemId: 'getWishByItemId',
	getSelected: 'getSelected',
	getMyWishByItemId: 'getMyWishByItemId',
	selection: 'selection',
};

export const getters = {
	[ActivityGetters.getSelected]: state => ([...(state.wishlist || []), ...state.lastItems.items]).filter(post => post.selected),
	[ActivityGetters.getPostById]: state => id => state.blog && state.blog.find(i => i.guid === id),
	[ActivityGetters.getWishByItemId]: state => id =>
		state.wishlist && state.wishlist.find(post => post.getItem(id)),
	[ActivityGetters.getMyWishByItemId]: state => id => state.myWishlist.find(post => post.getItem(id)),
	[ActivityGetters.selection]: state => (term, exclude) => {
		const filterFunc = (w) => {
			if (w === exclude) {
				return false;
			}
			if (!term) {
				return true;
			}
			return w.item.title.toLowerCase().includes(term.toLowerCase());
		};
		const setSelectedFunc = (w) => {
			w.selected = state.selected.includes(w);
			return w;
		};

		let wishlist = (state.wishlist || [])
			.filter(filterFunc);
		const ids = new Set(wishlist.map(p => p.postId));
		wishlist = Array.from(ids)
			.map(id => wishlist.find(p => p.postId === id))
			.map(setSelectedFunc);

		const lastItems = state.lastItems.items
			.filter(filterFunc)
			.filter(w1 => !wishlist.find(w2 => w1.postId === w2.postId))
			.map(setSelectedFunc);

		return {
			wishlist,
			lastItems,
		};
	},
};

export const ActivityMutations = {
	addPost: 'addPost',
	removePost: 'removePost',
	removeWish: 'removeWish',
	clearWishlist: 'clearWishlist',
	clearBlog: 'clearBlog',
	setListOfType: 'setListOfType',
	unsquadd: 'unsquadd',
	markAllLoaded: 'markAllLoaded',
	setLoading: 'setLoading',
	removeMyWish: 'removeMyWish',
	lastItems: 'lastItems',
	selectItem: 'selectItem',
	unselectAll: 'unselectAll',
	reset: 'reset',
};

const exportWishlistToMerchant = (wishlist) => {
	window.parent.postMessage(
		JSON.stringify({
			type: 'wishlist',
			wishlist: wishlist.map(w => w.item.itemId),
		}),
		'*',
	);
};

export const mutations = {
	[ActivityMutations.addPost]: (state, { post, merchantId, userId }) => {
		!state.blog && (state.blog = []);
		!state.wishlist && (state.wishlist = []);

		if (!state.guid.wishlist || state.guid.wishlist === userId) {
			state.wishlist.unshift(post);

			if (post.item.merchantId === merchantId) {
				state.myWishlist.unshift(post);
				exportWishlistToMerchant(state.myWishlist);
			}
		}
		if (!state.guid.blog || state.guid.blog === userId) {
			state.blog.unshift(post);
		}
	},
	[ActivityMutations.clearWishlist]: (state) => {
		state.wishlist = null;
	},
	[ActivityMutations.clearBlog]: (state) => {
		state.blog = null;
	},
	[ActivityMutations.setListOfType]: (state, payload) => {
		const { posts, type, isMine } = payload;

		if (type === 'wishlist' && isMine && sessionStorage.getItem(WISHLIST_LOADED)) {
			state.myWishlist = posts;
			exportWishlistToMerchant(posts);
			sessionStorage.removeItem(WISHLIST_LOADED);
		} else {
			state[type] = posts.filter(p => !postReported(p));
		}
	},
	[ActivityMutations.removePost]: (state, postId) => {
		if (!postId) {
			return;
		}
		state.blog = state.blog && state.blog.filter(p => p.postId !== postId);
		state.wishlist = state.wishlist && state.wishlist.filter(p => p.postId !== postId);
		state.myWishlist = state.myWishlist && state.myWishlist.filter(p => p.postId !== postId);
	},
	[ActivityMutations.removeWish]: (state, wish) => {
		if (!wish) {
			return;
		}
		state.wishlist = (state.wishlist || []).filter(w => w !== wish);
	},
	[ActivityMutations.removeMyWish]: (state, wish) => {
		if (!wish) {
			return;
		}
		state.myWishlist = state.myWishlist.filter(w => w !== wish);
		exportWishlistToMerchant(state.myWishlist);
	},
	[ActivityMutations.unsquadd]: (state, itemId) => {
		if (!itemId) {
			return;
		}
		state.blog && state.blog.forEach((post, index) => {
			const item = post.getItem(itemId);
			if (item) {
				if (post.type === 'singleItemPost') {
					state.blog.splice(index, 1);
				} else {
					item.squadded = false;
				}
			}
		});
	},
	[ActivityMutations.markAllLoaded]: (state, { loadedPosts, type }) => {
		if (loadedPosts.length === 0 && !state.loadedNew) {
			state.allLoaded[type] = true;
		}
	},
	[ActivityMutations.setLoading]: (state, { type, loading }) => {
		state.loading[type] = loading;
	},
	[ActivityMutations.lastItems]: (state, items) => {
		state.lastItems = {
			items: items || [],
			ts: Date.now(),
		};
	},
	[ActivityMutations.unselectAll]: (state) => {
		state.selected.forEach(s => (s.selected = false));
		state.selected = [];
	},
	[ActivityMutations.selectItem]: (state, post) => {
		if (state.selected.includes(post)) {
			state.selected = state.selected.filter(s => s !== post);
		} else {
			state.selected = [...state.selected, post];
		}
		post.selected = !post.selected;
	},
	[ActivityMutations.reset]: (currentState) => {
		const initialState = state();
		Object.keys(currentState).forEach((key) => {
			if (typeof initialState[key] === 'object' && initialState[key]) {
				Object.assign(currentState[key], initialState[key]);
			} else {
				currentState[key] = initialState[key];
			}
		});
	},
};

export const ActivityActions = {
	unwish: 'unwish',
	fetchItems: 'fetchItems',
};

export const actions = {
	[ActivityActions.unwish]: ({ commit, getters, rootState }, item) => {
		const { itemId, varId, merchantId: itemMerchantId } = item;
		rootState.socket.$ws.sendObj({
			type: 'unwish',
			itemId,
			itemMerchantId,
			varId,
		});

		const wish = getters[ActivityGetters.getWishByItemId](itemId);
		if (wish && !rootState.activity.guid.wishlist) {
			commit(ActivityMutations.removeWish, wish);
		}
		const myWish = getters[ActivityGetters.getMyWishByItemId](itemId);

		if (myWish) {
			commit(ActivityMutations.removeMyWish, myWish);
		}
		commit(ActivityMutations.unsquadd, itemId);
	},
	[ActivityActions.fetchItems]: ({ rootState, commit }, { type, guid, loadNew, forMerchant }) => {
		if (!rootState.socket.isAuth) {
			return;
		}
		const capitalized = type.charAt(0).toUpperCase() + type.slice(1);

		if (guid !== rootState.activity.guid[type]) {
			commit(ActivityMutations[`clear${capitalized}`]);
			rootState.activity.guid[type] = guid;
			rootState.activity.allLoaded[type] = false;
		}
		if (rootState.activity.allLoaded[type]) {
			return;
		}
		const items = rootState.activity[type];
		const mostRecent = items && items.length && items[items.length - 1];
		const msg = {
			type: `fetch${capitalized}`,
		};

		if (type === 'wishlist') {
			if (forMerchant) {
				msg.from = '*';
				sessionStorage.setItem(WISHLIST_LOADED, Date.now().toString());
			} else if (!isMonoMerchant(rootState)) {
				msg.allMerchants = '*';
			}
		}

		if (!loadNew && !forMerchant) {
			mostRecent && (msg.from = mostRecent.ts);
			rootState.activity.loadedNew = false;
		} else {
			rootState.activity.loadedNew = true;
		}
		guid && (msg.guid = guid);
		rootState.socket.$ws.sendObj(msg);
		commit(ActivityMutations.setLoading, { type, loading: true });
		setTimeout(() => commit(ActivityMutations.setLoading, { type, loading: false }), LOADING_TIMEOUT);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
