import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { PostStore, PostActions, PostGetters, PostMutations } from '~/store/post';
import { UserStore, UserMutations } from '~/store/user';
import { isHome } from '~/helpers';

export const dispatch = async function (store, message) {
	const { type } = message;
	if (['singleItemPost', 'pollPost', 'outfitPost'].includes(type)) {
		if (!store.state.feed.items.length) {
			// tmp patch while infinite scroll not ready
			store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
		}
		const post = await store.dispatch(`${PostStore}/${PostActions.receiveItem}`, message);
		post && store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
	} else if (type === 'feed') {
		const newPosts = await store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, message.feed);
		store.commit(`${FeedStore}/${FeedMutations.addBulk}`, newPosts);
	} else if (type === 'ping') {
		store.state.socket._ws.sendObj({ type: 'pong' });
	} else if (type === 'like') {
		const { guid, likes } = message;
		const post = store.getters[`${PostStore}/${PostGetters.getPostById}`](guid);
		post && store.commit(`${PostStore}/${PostMutations.setPostLike}`, { ...likes, post });
	} else if (type === 'notifLike') {
		const { iLike, postId, user } = message;
		const mod = (iLike ? 1 : -1);

		const post = store.getters[`${PostStore}/${PostGetters.getPostById}`](postId);
		if (iLike) {
			store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
			store.commit(`${PostStore}/${PostMutations.addLike}`, { post, user });
		}

		store.dispatch(`${PostStore}/${PostActions.modifyLike}`, { mod, post });
	} else if (type === 'notifComment') {
		const { postId, text, user } = message;

		store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);

		const post = store.getters[`${PostStore}/${PostGetters.getPostById}`](postId);
		const comment = {
			text,
			author: user,
		};
		store.commit(`${PostStore}/${PostMutations.addComment}`, { comment, post });
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
	} else if (['wishlist', 'blog', 'squadders'].includes(type)) {
		const rawPostsList = message[type];
		if (type === 'wishlist') {
			rawPostsList.forEach(w => (w.guid = w.item.itemId));
		}
		await store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, rawPostsList);
		const posts = store.getters[`${PostStore}/${PostGetters.getPostByIdList}`](rawPostsList.map(r => r.guid))
			.sort((a, b) => b.ts - a.ts);
		store.commit(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts, type });
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
	const { app, store } = ctx;
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
				app.router.push(route, () => store.commit('SET_PENDING', false));
			} else {
				store.commit('SET_PENDING', false);
			}
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
			signOut(store, app.router);
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
