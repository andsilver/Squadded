import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import { FeedStore, FeedActions, FeedGetters } from '../../store/feed';

export const dispatch = function (store, message) {
	if (message.type === 'singleItemPost') {
		store.dispatch(`${FeedStore}/${FeedActions.receiveItem}`, message);
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
			const { error, guid, userId, _jwt, ...clean } = data;
			this._ws.sendObj(clean);
		}
	}
}

export const connect = function (store) {
	const merchantId = store.state.merchant.id;
	const userToken = localStorage.getItem('userToken');
	if (!userToken || !merchantId) {
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

export const mutationListener = (store, redirect, route) => function mutationDispatcher (mutation, state) {
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
			if (route.name === 'index' || route.name === 'lang') {
				redirect({ path: '/feed' });
			}
			const msg = { type: 'fetchPosts' };
			if (store.getters[`${FeedStore}/${FeedGetters.items}`][0]) {
				msg.ts = store.getters[`${FeedStore}/${FeedGetters.items}`][0].ts;
			}
			state.socket.$ws.sendObj(msg);
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
			Vue.prototype.$disconnect();
			if (!(route.name === 'index' || route.name === 'lang')) {
				redirect({ path: '/' });
			}
		}
		return;
	}

	if (mutation.type === 'SET_MERCHANT_ID') {
		connect(store);
	}
};

export default ({ store, redirect, route }) => {
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

	store.subscribe(mutationListenerShadow(store, redirect, route));

	connect(store);
};
