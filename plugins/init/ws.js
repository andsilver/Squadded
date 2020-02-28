import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import { WSMessages } from '~/classes/WSMessages';
import { WSToken } from '~/classes/WSToken';
import { isHome, isOnboarding, prefetch } from '~/helpers';
import { NotificationStore, NotificationActions } from '~/store/notification';
import { UserStore, UserMutations } from '~/store/user';
import { DEFAULT_LANDING } from '~/store/squad';

export const connect = function (store) {
	const merchantId = store.state.merchant.id;
	if (!merchantId) {
		return;
	}

	store.commit('SET_PENDING', false);
	const userToken = store.state.user.me.userId;
	if (!userToken) {
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

const signOut = (store, router) => {
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
			const user = await prefetch({
				mutation: `${UserStore}/${UserMutations.setMe}`,
				store,
				type: 'fetchUser',
			});
			store.commit('SET_PENDING', false);
			if (window.FS) {
				window.FS.identify(user.userId, {
					displayName: user.screenName || user.name,
				});
			}

			const { route } = state.squad;
			if (route.name) {
				app.router.push(route);
			} else if (!user.nameSelected) {
				app.router.push('/select-username');
			} else if (!user.squaddersCount) {
				app.router.push('/create-your-squad');
			} else {
				const { name } = ctx.route;
				app.router.push((isHome(name) || isOnboarding(name)) ? DEFAULT_LANDING : ctx.route.path);
			}
			fetchNotifications();
		}

		if (!state.socket.isAuth) {
			return;
		}

		wsMessages.dispatch(message);
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

	ctx.wsMessages = new WSMessages(store);
	store.subscribe(mutationListenerShadow(ctx));

	connect(store);
};
