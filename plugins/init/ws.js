import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import { ActivityStore, ActivityGetters, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedActions, FeedGetters } from '~/store/feed';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { UserStore, UserMutations } from '~/store/user';
import { isHome } from '~/helpers';

export const dispatch = function (store, message) {
	const { type } = message;
	if (type === 'singleItemPost' || type === 'pollPost') {
		if (!store.state.feed.items.length) {
			// tmp patch while infinite scroll not ready
			store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
		}
		store.dispatch(`${FeedStore}/${FeedActions.receiveItem}`, message);
	} else if (type === 'feed') {
		store.dispatch(`${FeedStore}/${FeedActions.receiveBulk}`, message.feed);
	} else if (type === 'ping') {
		store.state.socket._ws.sendObj({ type: 'pong' });
	} else if (type === 'like') {
		const { guid, likes } = message;
		let post = store.getters[`${FeedStore}/${FeedGetters.getPostById}`](guid);
		post && store.commit(`${PostStore}/${PostMutations.setPostLike}`, { ...likes, post });

		post = store.getters[`${ActivityStore}/${ActivityGetters.getPostById}`](guid);
		post && store.commit(`${PostStore}/${PostMutations.setPostLike}`, { ...likes, post });
	} else if (type === 'notifLike') {
		const { postId, iLike } = message;
		const mod = (iLike ? 1 : -1);

		if (iLike) {
			store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
		}

		const feedPost = store.getters[`${FeedStore}/${FeedGetters.getPostById}`](postId);
		store.dispatch(`${PostStore}/${PostActions.modifyLike}`, { mod, post: feedPost });

		const myBlogPost = store.getters[`${ActivityStore}/${ActivityGetters.getPostById}`](postId);
		store.dispatch(`${PostStore}/${PostActions.modifyLike}`, { mod, post: myBlogPost });
	} else if (type === 'notifComment') {
		const { comment, postId } = message;

		store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);

		const feedPost = store.getters[`${FeedStore}/${FeedGetters.getPostById}`](postId);
		store.commit(`${PostStore}/${PostMutations.addComment}`, { comment, post: feedPost });

		const myBlogPost = store.getters[`${ActivityStore}/${ActivityGetters.getPostById}`](postId);
		store.commit(`${PostStore}/${PostMutations.addComment}`, { comment, post: myBlogPost });
	} else if (type === 'notifications') {
		store.commit(`${NotificationStore}/${NotificationMutations.receive}`, message.notifications);
	} else if (type === 'comments' || type === 'likes') {
		store.commit(`${PostStore}/${PostMutations.receiveReaction}`, message[type]);
	} else if (type === 'userProfile') {
		const { user } = message;
		if (user.userId === store.state.user.me.userId) {
			return store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		}
		store.commit(`${UserStore}/${UserMutations.setOther}`, user);
	} else if (type === 'followers' || type === 'following') {
		store.commit(`${UserStore}/${UserMutations.setUserList}`, message.users);
	} else if (type === 'wishlist') {
		store.commit(`${ActivityStore}/${ActivityMutations.setWishlist}`, message.wishlist);
	} else if (type === 'blog') {
		store.commit(`${ActivityStore}/${ActivityMutations.setBlog}`, message.blog);
	} else if (type === 'squadders') {
		store.commit(`${ActivityStore}/${ActivityMutations.setSquadders}`, message);
	} else {
		// TODO report
	}
};

const KEEP_ALIVE_INTERVAL_MS = 30000;

export class WSToken {
	constructor(ws) {
		this._ws = ws;
		this._timeoutId = null;
	}

	sendObj (data) {
		const _jwt = localStorage.getItem('userToken');
		if (_jwt) {
			const { error, userId, _jwt, ...clean } = data;
			this._ws.sendObj(clean);
			this.stop();
			this.keepAlive();
		}
	}

	keepAlive() {
		this._timeoutId = setTimeout(() => {
			this._ws.send(JSON.stringify({ type: 'ping' }));
			this.keepAlive();
		}, KEEP_ALIVE_INTERVAL_MS);
	}

	stop () {
		clearTimeout(this._timeoutId);
	}
}

export const connect = function (store) {
	const merchantId = store.state.merchant.id;
	if (!merchantId) {
		return;
	}

	const userToken = store.state.user.me.userId;
	if (!userToken) {
		return store.commit('SET_PENDING', false);
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

const signOut = (store, router) => {
	store.commit('SET_SOCKET_AUTH', false);
	store.commit('SET_PENDING', false);
	Vue.prototype.$disconnect();
	delete Vue.prototype.$ws;
	store.commit('jSocket', null);
	localStorage.removeItem('userToken');
	router.push('/');
};

export const mutationListener = ctx => function mutationDispatcher (mutation, state) {
	const { store, redirect } = ctx;
	function fetchUser() {
		state.socket.$ws.sendObj({ type: 'fetchUser' });
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
			state.socket.$ws.keepAlive();
			if (isHome(ctx.route.name)) {
				const { route } = state.squad;
				redirect(route);
			}
			store.commit('SET_PENDING', false);
			fetchUser();
		}

		if (!state.socket.isAuth) {
			return;
		}

		dispatch(store, message);
		return;
	}

	if (mutation.type === 'SOCKET_ONCLOSE') {
		state.socket.$ws.stop();
		if (mutation.payload.reason) {
			signOut(store, ctx.app.router);
		}
		return;
	}

	if (mutation.type === 'SET_MERCHANT_PARAMS') {
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
