import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';

export const dispatch = function (store, message) {
	if (message.type === 'FEED_ITEM' && message.item) {
		store.dispatch('feed/receiveItem', message.item);
	} else {
		// TODO report
	}
};

export default ({ app, store }) => {
	const { wsLink } = process.env;
	if (!wsLink) {
		throw new Error('WebSocket connection link is not provided.');
	}
	Vue.use(VueNativeSock, wsLink, {
		store,
		format: 'json',
		connectManually: true,
		reconnection: true,
	});

	store.subscribe((mutation, state) => {
		if (mutation.type === 'SOCKET_ONOPEN') {
			Vue.prototype.$ws = event.currentTarget; // to be used in components
			state.socket.$ws = event.currentTarget; // to be used in store modules
			return;
		}

		if (mutation.type === 'SOCKET_ONMESSAGE') {
			dispatch(store, mutation.payload);
		}
	});
};
