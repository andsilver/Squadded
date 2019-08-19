import feed from './feed';

export const state = () => ({
	locales: ['en'],
	locale: 'en',
	socket: {
		isConnected: false,
		reconnectError: false,
		ws: null,
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
		state.socket.$ws = event.currentTarget; // to be used in store modules
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
};

export const modules = {
	feed,
};
