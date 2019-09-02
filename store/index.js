import feed from './feed';

export const state = () => ({
	locales: ['en'],
	locale: 'en',
	socket: {
		isConnected: false,
		reconnectError: false,
		$ws: null,
		_ws: null,
	},
	merchant: {
		id: null,
		forbidden: false,
	},
});

export const mutations = {
	SET_LANG (state, locale) {
		if (state.locales.includes(locale)) {
			state.locale = locale;
		}
	},
	SOCKET_ONOPEN (state, event) {
		state.socket.isConnected = true;
		state.socket._ws = event.currentTarget; // to be used internally
	},
	jSocket (state, $ws) {
		state.socket.$ws = $ws;
	},
	SOCKET_ONCLOSE (state, event) {
		state.socket.isConnected = false;
	},
	SOCKET_ONERROR (state, event) {
	},
	SOCKET_ONMESSAGE (state, message) {
	},
	SOCKET_RECONNECT (state, event) {
	},
	SOCKET_RECONNECT_ERROR (state, event) {
	},
	SET_MERCHANT_ID (state, id) {
		state.merchant.id = id;
	},
	SET_MERCHANT_FORBIDDEN (state, flag) {
		state.merchant.forbidden = flag;
	},
};

export const modules = {
	feed,
};
