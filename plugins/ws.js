import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';

export const dispatch = function (store, message) {
	if (message.type === 'singleItemPost') {
		store.dispatch('feed/receiveItem', message);
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
		const { error, guid, ts, ...clean } = data;
		this._ws.sendObj(Object.assign(clean, {
			_jwt,
		}));
	}
}

export default ({ store }) => {
	const { WS_LINK } = process.env;
	if (!WS_LINK) {
		throw new Error('WebSocket connection link is not provided.');
	}
	const wsLink = new URL(WS_LINK);
	// pass user token in search params of connection url
	// due to no other way to pass data while connecting
	// Headers and Cookies are not supported by browsers
	wsLink.searchParams.set('userToken', localStorage.getItem('userToken'));
	Vue.use(VueNativeSock, wsLink.toString(), {
		store,
		format: 'json',
		connectManually: true,
		reconnection: true,
	});

	store.subscribe((mutation, state) => {
		if (mutation.type === 'SOCKET_ONOPEN') {
			const $ws = new WSToken(state.socket._ws);
			Vue.prototype.$ws = $ws; // to be used in components
			store.commit('jSocket', $ws);
			return;
		}

		if (mutation.type === 'SOCKET_ONMESSAGE') {
			dispatch(store, mutation.payload);
		}
	});
};
