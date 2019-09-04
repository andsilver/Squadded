// import merchant from '../services/merchant';
import { FeedStore, FeedActions } from '../store/feed';

export const context = function ({ store }) {
	return function parseMessage (event) {
		let msg;
		try {
			msg = JSON.parse(event.data);
		} catch (error) {
			// TODO gracefull report
			return;
		}

		if (msg.type === 'singleItemPost') {
			store.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg);
		} else if (msg.type === 'injectMerchantId') {
			const { merchantId } = msg;
			store.commit('SET_MERCHANT_ID', merchantId);
			/* return merchant.validateAllowedOrigins(merchantId)
				.then(() => {
					store.commit('SET_MERCHANT_ID', merchantId);
				})
				.catch(() => {
					store.commit('SET_MERCHANT_FORBIDDEN', true);
				}); */
		} else {
			// TODO gracefull report
			// console.warn('Uknonwn message type', msg);
		}
	};
};

export default function (ctx) {
	window.addEventListener('message', context(ctx));

	const { ancestorOrigins } = window.location;
	if (!ancestorOrigins || (ancestorOrigins && !ancestorOrigins.length)) {
		return;
	}
	const parentOrigin = ancestorOrigins[ancestorOrigins.length - 1];
	window.parent.postMessage('SquadWidgetIsReady', parentOrigin);
};
