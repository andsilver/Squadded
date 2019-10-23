import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { FeedStore, FeedActions, FeedGetters } from '~/store/feed';
import { UserGetters, UserStore, UserMutations } from '~/store/user';
import { isHome } from '~/helpers';

export const dispatch = function (store, message) {
	const { type } = message;
	if (type === 'singleItemPost') {
		store.dispatch(`${FeedStore}/${FeedActions.receiveItem}`, message);
	} else if (type === 'ping') {
		store.state.socket._ws.sendObj({ type: 'pong' });
	} else if (type === 'like') {
		const { guid, likes } = message;
		const post = store.getters[`${FeedStore}/${FeedGetters.getPostById}`](guid);
		store.commit(`${PostStore}/${PostMutations.setPostLike}`, { ...likes, post });
	} else if (type === 'notifLike') {
		const { postId, iLike } = message;
		const mod = (iLike ? 1 : -1);
		const feedPost = store.getters[`${FeedStore}/${FeedGetters.getPostById}`](postId);
		store.dispatch(`${PostStore}/${PostActions.modifyLike}`, { mod, post: feedPost });

		const myBlogPost = store.getters[`${UserStore}/${UserGetters.getPostById}`](postId);
		store.dispatch(`${PostStore}/${PostActions.modifyLike}`, { mod, post: myBlogPost });
	} else if (type === 'notifComment') {
		const { comment, postId } = message;
		const feedPost = store.getters[`${FeedStore}/${FeedGetters.getPostById}`](postId);
		store.commit(`${PostStore}/${PostMutations.addComment}`, { comment, post: feedPost });

		const myBlogPost = store.getters[`${UserStore}/${UserGetters.getPostById}`](postId);
		store.commit(`${PostStore}/${PostMutations.addComment}`, { comment, post: myBlogPost });
	} else if (type === 'comments') {
		store.commit(`${PostStore}/${PostMutations.receiveComments}`, message.comments);
	} else if (type === 'userProfile') {
		const { user } = message;
		if (user.userId === store.state.user.me.userId) {
			return store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		}
		store.commit(`${UserStore}/${UserMutations.setOther}`, user);
	} else if (type === 'wishlist') {
		store.commit(`${UserStore}/${UserMutations.setWishlist}`, message);
	} else if (type === 'blog') {
		store.commit(`${UserStore}/${UserMutations.setBlog}`, message);
	} else {
		// TODO report
	}
};

export class WSToken {
	constructor(ws) {
		this._ws = ws;
	}

	/**
	 * Append user JWT to Web Socket message
	 *
	 * @paarm {object} data
	 */
	sendObj (data) {
		const _jwt = localStorage.getItem('userToken');
		if (_jwt) {
			const { error, userId, _jwt, ...clean } = data;
			this._ws.sendObj(clean);
		}
	}
}

export const connect = function (store) {
	const userToken = store.state.user.me.userId;
	if (!userToken) {
		return store.commit('SET_PENDING', false);
	}

	const merchantId = store.state.merchant.id;
	if (!merchantId) {
		return;
	}
	Vue.prototype.$connect();
};

export const initSocket = (link, store) => {
	Vue.use(VueNativeSock, link, {
		store,
		format: 'json',
		reconnection: true,
		reconnectionAttempts: 10,
		reconnectionDelay: 5000,
		connectManually: true,
	});
};

export const mutationListener = ctx => function mutationDispatcher (mutation, state) {
	const { store, redirect } = ctx;
	function fetchUser() {
		state.socket.$ws.sendObj({ type: 'fetchUser' });
	}

	function fetchPosts() {
		store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
	}

	if (mutation.type === 'SOCKET_ONOPEN') {
		const $ws = new WSToken(state.socket._ws);
		Vue.prototype.$ws = $ws; // to be used in components
		store.commit('jSocket', $ws);
		return;
	}

	if (mutation.type === 'SOCKET_ONMESSAGE') {
		const message = mutation.payload;
		if (message.type === 'authRequest') {
			state.socket._ws.sendObj({
				type: 'authResponse',
				userToken: localStorage.getItem('userToken'),
				merchantId: state.merchant.id,
			});
			return;
		} else if (message.type === 'authOk') {
			store.commit('SET_SOCKET_AUTH', true);
			if (isHome(ctx.route.name)) {
				const { route } = state.squad;
				redirect(route);
			} else {
				store.commit('SET_PENDING', false);
			}
			fetchUser();
			fetchPosts();
		}

		if (!state.socket.isAuth) {
			return;
		}

		dispatch(store, message);
		return;
	}

	if (mutation.type === 'SOCKET_ONCLOSE') {
		if (mutation.payload.reason) {
			store.commit('SET_SOCKET_AUTH', false);
			store.commit('SET_PENDING', false);
			Vue.prototype.$disconnect();
			if (!isHome(ctx.route.name)) {
				redirect({ path: '/' });
			}
		}
		return;
	}

	if (mutation.type === 'SET_MERCHANT_ID') {
		connect(store);
	}
};

export default (ctx) => {
	const { store } = ctx;
	const { WS_LINK } = process.env;
	if (!WS_LINK) {
		throw new Error('WebSocket connection link is not provided.');
	}

	// to be able to spyOn >.<
	let initSocketShadow = initSocket;
	let mutationListenerShadow = mutationListener;
	if (module.exports) {
		initSocketShadow = module.exports.initSocket;
		mutationListenerShadow = module.exports.mutationListener;
	}
	initSocketShadow(WS_LINK, store);

	store.subscribe(mutationListenerShadow(ctx));

	connect(store);
};
