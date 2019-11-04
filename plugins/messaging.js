import { FeedStore, FeedActions } from '../store/feed';
import { connect } from './init/ws';
import { UserStore, UserMutations } from '~/store/user';
import { SquadStore, SquadMutations } from '~/store/squad';

export const dispatch = (store, msg) => {
	switch (true) {
	case msg.type === 'singleItemPost' || msg.type === 'pollPost':
		store.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
		break;

	case msg.type === 'loggedIn':
		store.commit(`${UserStore}/${UserMutations.setToken}`, msg.userToken);
		connect(store);
		break;

	case msg.type === 'injectMerchantId':
		const { merchantId } = msg;
		store.commit('SET_MERCHANT_ID', merchantId);
		break;

	case msg.type === 'injectSquadParams':
		const { squad } = msg;
		store.commit(`${SquadStore}/${SquadMutations.setSquadParams}`, squad);
		break;

	default:
		// TODO gracefull report
		// console.warn('Uknonwn message type', msg);
		break;
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
