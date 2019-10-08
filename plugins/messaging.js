// import merchant from '../services/merchant';
import { FeedStore, FeedActions } from '../store/feed';
import { connect } from './init/ws';
import { UserStore, UserMutations } from '~/store/user';

export const dispatch = (store, msg) => {
	if (msg.type === 'singleItemPost') {
		store.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
	} else if (msg.type === 'loggedIn') {
		store.commit(`${UserStore}/${UserMutations.setToken}`, msg.userToken);
		connect(store);
	} else if (msg.type === 'injectMerchantId') {
		const { merchantId } = msg;
		store.commit('SET_MERCHANT_ID', merchantId);
	} else {
		// TODO gracefull report
		// console.warn('Uknonwn message type', msg);
	}
};

export default function (ctx) {
	function parseMessage (event) {
		let msg;
		try {
			msg = JSON.parse(event.data);
		} catch (error) {
			// TODO gracefull report
			return;
		}

		const { store } = ctx;
		dispatch(store, msg);
	}

	window.addEventListener('message', parseMessage);
	window.parent.postMessage('SquadWidgetIsReady', '*');
};
