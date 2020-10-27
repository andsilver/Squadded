import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import { WSMessages } from '~/classes/WSMessages';
import { WSToken } from '~/classes/WSToken';
import { prefetch } from '~/helpers';
import { NotificationStore, NotificationActions } from '~/store/notification';
import { UserStore, UserMutations } from '~/store/user';
import { WS_LINK } from '~/config';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { VISITED_INVITE_FRIENDS_KEY } from '~/consts/keys';
import { DEFAULT_LANDING } from '~/store/squad';
import { clearLocalStorage } from '~/utils/local-storage';

export const connect = function (store) {
	const merchantId = store.state.merchant.id;
	const userToken = store.state.user.me.userId;

	window.FS && window.FS.shutdown();

	if (!merchantId || !userToken) {
		store.commit('SET_PENDING', false);
		return;
	}
	store.commit('SET_PENDING', true);
	Vue.prototype.$connect();
	return true;
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
	clearLocalStorage();
	sessionStorage.clear();
	window.parent.postMessage(JSON.stringify({
		type: 'signout',
	}), '*');
	window.FS && window.FS.shutdown();
	router.push('/');
	location.reload();
};

export const mutationListener = ctx => async function mutationDispatcher (mutation, state) {
	const { app, store, wsMessages } = ctx;

	const fetchNotifications = () => {
		store.dispatch(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
	};

	const fetchWishlist = () => {
		store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
			type: 'wishlist',
			forMerchant: true,
		});
	};

	const fetchSquadders = () => {
		prefetch({
			type: 'fetchSquadders',
			store,
		});
	};

	const { route } = state.squad;
	const setPendingFalse = () => store.commit('SET_PENDING', false);

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
			fetchWishlist();
			store.commit('SET_SOCKET_AUTH', true);
			state.socket.$ws.keepAlive();
			const user = await prefetch({
				mutation: `${UserStore}/${UserMutations.setMe}`,
				store,
				type: 'fetchUser',
			});
			fetchNotifications();
			fetchSquadders();

			window.parent.postMessage(JSON.stringify({
				type: 'signin',
			}), '*');

			if (window.FS) {
				window.FS.restart();
				window.FS.identify(user.userId, {
					displayName: user.screenName || user.name,
					merchantId: state.merchant.id,
				});
			}

			if (user.language) {
				store.state.locale = user.language;
				app.i18n.locale = user.language;
				app.i18n.fallbackLocale = user.language;
				window.parent.postMessage(JSON.stringify({
					type: 'language',
					language: user.language,
				}), '*');
			}

			const visitedInviteFriends = localStorage.getItem(VISITED_INVITE_FRIENDS_KEY);

			if (user.origin === 'invitation') {
				// TODO What is it for? It is same as two below.
				if (!user.squaddersCount && !visitedInviteFriends) {
					return app.router.push('/invite-friends', setPendingFalse);
				} else if (route.params && user.originUserId === route.params.id) {
					return app.router.push(DEFAULT_LANDING, setPendingFalse);
				}
			}
			if (route.name) {
				setTimeout(() => setPendingFalse(), 2000);
				return app.router.push(route);
			}
			if (!user.nameSelected) {
				return app.router.push('/select-username', setPendingFalse);
			}
			if (!user.squaddersCount && !visitedInviteFriends) {
				return app.router.push('/invite-friends', setPendingFalse);
			}
			const latestPath = sessionStorage.getItem('latestPath');
			const latestHash = sessionStorage.getItem('latestHash');

			if (latestPath && latestPath !== '/' && latestPath !== '/onboarding') {
				app.router.push({
					path: latestPath,
					hash: latestHash,
				}, setPendingFalse);
			} else {
				app.router.push(DEFAULT_LANDING, setPendingFalse);
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
		const connecting = connect(store);
		const { params } = route;
		const { onboarding: { videos } } = state;

		if (!connecting && videos.length && (!params || !params.id)) {
			app.router.push('/onboarding', setPendingFalse);
		}
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
};
