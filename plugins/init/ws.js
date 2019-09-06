import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import { FeedStore, FeedActions } from '../../store/feed';

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
			const { error, guid, ts, userId, _jwt, ...clean } = data;
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

export default ({ store, redirect }) => {
	const { WS_LINK } = process.env;
	if (!WS_LINK) {
		throw new Error('WebSocket connection link is not provided.');
	}
	Vue.use(VueNativeSock, WS_LINK, {
		store,
		format: 'json',
		reconnection: true,
		connectManually: true,
	});

	store.subscribe((mutation, state) => {
		if (mutation.type === 'SOCKET_ONOPEN') {
			const $ws = new WSToken(state.socket._ws);
			Vue.prototype.$ws = $ws; // to be used in components
			store.commit('jSocket', $ws);
			redirect({ path: '/feed' });
			return;
		}

		if (mutation.type === 'SOCKET_ONMESSAGE') {
			const message = mutation.payload;
			if (message.type === 'authRequest') {
				state.socket._ws.sendObj({
					type: 'authResponse',
					userToken: localStorage.getItem('userToken'),
					merchantId: store.state.merchant.id,
				});
				return;
			} else if (message.type === 'authOk') {
				store.commit('SET_SOCKET_AUTH', true);
			}

			if (!state.socket.isAuth) {
				return;
			}

			dispatch(store, message);
			return;
		}

		if (mutation.type === 'SOCKET_ONCLOSE') {
			if (mutation.payload.reason) {
				Vue.prototype.$disconnect();
			}
			return;
		}

		if (mutation.type === 'SET_MERCHANT_ID') {
			connect(store);
		}
	});
};
