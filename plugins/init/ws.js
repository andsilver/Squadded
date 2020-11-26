import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import { WSMessages } from '~/classes/WSMessages';
import { WSToken } from '~/classes/WSToken';
import { prefetch } from '~/helpers';
import { NotificationStore, NotificationActions } from '~/store/notification';
import { SquadStore, SquadMutations, DEFAULT_LANDING } from '~/store/squad';
import { UserStore, UserMutations } from '~/store/user';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { WS_LINK } from '~/config';
import { VISITED_INVITE_FRIENDS_KEY, LOADING_TIMEOUT } from '~/consts';
import { clearLocalStorage } from '~/utils/local-storage';
import { tokenExist } from '~/utils/isAuth';
import { SquadAPI } from '~/services/SquadAPI';

export const connect = function (store, guest = false) {
	const merchantId = store.state.merchant.id;
	const userToken = store.state.user.me.userId;

	window.FS && window.FS.shutdown();

	if (!merchantId || !userToken) {
		store.commit('SET_PENDING', false);
		return false;
	}
	if (!guest) {
		store.commit('SET_PENDING', true);
	}
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

export const signOut = (store, router, route = '/') => {
	store.commit('SET_SOCKET_AUTH', false);
	store.commit('SET_PENDING', false);
	Vue.prototype.$disconnect();
	Vue.prototype.$ws && Vue.prototype.$ws.stop();
	delete Vue.prototype.$ws;
	store.commit('jSocket', null);
	clearLocalStorage();
	sessionStorage.clear();
	window.parent.postMessage(JSON.stringify({
		type: 'signout',
	}), '*');
	window.FS && window.FS.shutdown();
	store.dispatch('RESET_STATE');
	route && router.push(route);
};

const setPendingFalse = store => store.commit('SET_PENDING', false);

const goToLatestRoute = (router, store, guest = false) => {
	const latestPath = sessionStorage.getItem('latestPath');
	const latestHash = sessionStorage.getItem('latestHash');

	if (latestPath && latestPath !== '/' && latestPath !== '/onboarding' && latestPath !== '/community') {
		router.push({
			path: latestPath,
			hash: latestHash,
		}, () => setPendingFalse(store));
	} else {
		router.push(guest ? '/all' : DEFAULT_LANDING, () => setPendingFalse(store));
	}
};

export const mutationListener = ctx => async function mutationDispatcher (mutation, state) {
	const { app, store, wsMessages } = ctx;
	const $root = app.router && app.router.app && app.router.app.$root;
	const { route } = state.squad;

	switch (mutation.type) {
	case 'SOCKET_ONOPEN': {
		const $ws = new WSToken(state.socket._ws);
		Vue.prototype.$ws = $ws; // to be used in components
		store.commit('jSocket', $ws);
		return;
	}

	case 'SOCKET_ONMESSAGE': {
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
			/** fetch wishlist */
			store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
				type: 'wishlist',
				forMerchant: true,
			});
			state.socket.$ws.keepAlive();
			const user = await prefetch({
				mutation: `${UserStore}/${UserMutations.setMe}`,
				store,
				type: 'fetchUser',
			});

			if (user.banned) {
				signOut(store, app.router, '');
				app.router.push('/', () => {
					store.state.banned = true;
					setPendingFalse(store);
				});
				return;
			}

			if (user.guest) {
				if (state.socket.isPendingAuth) {
					return app.router.push('/all', () => setPendingFalse(store));
				}
				return setPendingFalse(store);
			}
			/** fetch notifications */
			store.dispatch(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
			/** fetch squadders */
			prefetch({ type: 'fetchSquadders', store });

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
					return app.router.push('/invite-friends', () => setPendingFalse(store));
				} else if (route.params && user.originUserId === route.params.id) {
					return app.router.push(DEFAULT_LANDING, () => setPendingFalse(store));
				}
			}
			if (route.name) {
				setTimeout(() => setPendingFalse(store), 2000);
				return app.router.push(route);
			}
			if (!user.nameSelected) {
				return app.router.push('/select-username', () => setPendingFalse(store));
			}
			if (!user.squaddersCount && !visitedInviteFriends) {
				return app.router.push('/invite-friends', () => setPendingFalse(store));
			}
			return goToLatestRoute(app.router, store);
		}

		if (!state.socket.isAuth) {
			return;
		}
		return wsMessages.dispatch(message);
	}

	case 'SOCKET_ONCLOSE':
		if (!state.socket.$ws) {
			return;
		}

		if (mutation.payload.reason) {
			signOut(store, app.router);
		}
		return;

	case 'SET_MERCHANT_PARAMS': {
		const connecting = connect(store);
		const { params } = route;
		const { onboarding: { videos }, merchant: { guest } } = state;

		if (!connecting) {
			if ((params && params.id) || guest) {
				return;
			}
			if (videos.length) {
				app.router.push('/onboarding', () => setPendingFalse(store));
			}
		}
		return;
	}

	case 'SET_PENDING': {
		if (!mutation.payload) {
			return;
		}
		const { name } = ctx.route;

		if (name === 'feed' || name === 'all') {
			setTimeout(SquadAPI.rendered, LOADING_TIMEOUT);
		} else {
			SquadAPI.rendered();
		}
		return;
	}

	case `${SquadStore}/${SquadMutations.interaction}`:
		if (!tokenExist()) {
			app.router.push('/signin');
		}
		return;

	case `${SquadStore}/${SquadMutations.setSquadParams}`: {
		if (!mutation.payload) {
			return;
		}
		if (state.socket.isAuth) {
			app.router.push(state.squad.route);
		}
		const { name, params } = state.squad.route;

		if (!tokenExist() && name) {
			setTimeout(() => {
				if (name === 'user-id') {
					app.router.push({ path: '/', query: { userId: params.id } });
				} else {
					app.router.push(state.squad.route);
				}
			});
		}
		return;
	}

	case `${SquadStore}/${SquadMutations.openPost}`:
		if (!mutation.payload) {
			return;
		}
		return app.router.push(`/post/${mutation.payload}#comments`);

	case `${SquadStore}/${SquadMutations.setWidgetState}`:
		if (mutation.payload !== true) {
			return;
		}
		return $root && $root.$emit('widget-open');
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
