import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import { WSMessages } from '~/classes/WSMessages';
import { WSToken } from '~/classes/WSToken';
import { isHome, isOnboarding, prefetch } from '~/helpers';
import { NotificationStore, NotificationActions } from '~/store/notification';
import { UserStore, UserMutations } from '~/store/user';
import { DEFAULT_LANDING } from '~/store/squad';
import { WS_LINK } from '~/config';
import { ActivityStore, ActivityActions } from '~/store/activity';

export const connect = function (store) {
	const merchantId = store.state.merchant.id;
	if (!merchantId) {
		return;
	}

	const userToken = store.state.user.me.userId;
	if (!userToken) {
		store.commit('SET_PENDING', false);
		return;
	}
	store.commit('SET_PENDING', true);
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

export const signOut = (store, router) => {
	store.commit('SET_SOCKET_AUTH', false);
	store.commit('SET_PENDING', false);
	Vue.prototype.$disconnect();
	delete Vue.prototype.$ws;
	store.commit('jSocket', null);
	localStorage.removeItem('userToken');
	router.push('/');
};

export const mutationListener = ctx => async function mutationDispatcher (mutation, state) {
	const { app, store, wsMessages } = ctx;

	const fetchNotifications = () => {
		store.dispatch(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
	};

	const fetchWishlist = () => {
		store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
			type: 'wishlist',
		});
	};

	const fetchSquadders = () => {
		prefetch({
			type: 'fetchSquadders',
			store,
		});
	};

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
			setTimeout(() => {
				store.commit('SET_PENDING', false);
			}, 8000);
			return;
		} else if (message.type === 'authOk') {
			store.commit('SET_SOCKET_AUTH', true);
			state.socket.$ws.keepAlive();
			const user = await prefetch({
				mutation: `${UserStore}/${UserMutations.setMe}`,
				store,
				type: 'fetchUser',
			});
			fetchNotifications();
			fetchWishlist();
			fetchSquadders();

			if (window.FS) {
				window.FS.identify(user.userId, {
					displayName: user.screenName || user.name,
				});
			}

			if (user.language) {
				app.i18n.fallbackLocale = user.language;
				window.parent.postMessage(JSON.stringify({
					type: 'language',
					language: user.language,
				}), '*');
			}

			const { route } = state.squad;
			const setPendingFalse = () => store.commit('SET_PENDING', false);

			if (user.origin === 'invitation') {
				if (!user.nameSelected) {
					return app.router.push('/select-username', setPendingFalse);
				} else if (!user.squaddersCount) {
					return app.router.push('/invite-friends', setPendingFalse);
				}
			}
			if (route.name) {
				app.router.push(route, setPendingFalse);
			} else if (!user.nameSelected) {
				app.router.push('/select-username', setPendingFalse);
			} else if (!user.squaddersCount) {
				return app.router.push('/invite-friends', setPendingFalse);
			} else {
				const { name } = ctx.route;
				const latestPath = sessionStorage.getItem('latestPath');
				const latestHash = sessionStorage.getItem('latestHash');
				if (latestPath && latestPath !== '/signin' && latestPath !== '/') {
					return app.router.push({
						path: latestPath,
						hash: latestHash,
					}, setPendingFalse);
				} else if (isHome(name) || isOnboarding(name)) {
					return app.router.push(DEFAULT_LANDING, setPendingFalse);
				}
				return app.router.push(ctx.route.path, setPendingFalse);
			}
		}

		if (!state.socket.isAuth) {
			return;
		}

		wsMessages.dispatch(message);
		return;
	}

	if (mutation.type === 'SOCKET_ONCLOSE') {
		if (!state.socket.$ws) {
			return;
		}
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

	ctx.wsMessages = new WSMessages(store);
	store.subscribe(mutationListenerShadow(ctx));

	connect(store);
};
