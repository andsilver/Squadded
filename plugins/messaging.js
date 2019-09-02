export const context = function ({ store, redirect }) {
	return function parseMessage (event) {
		let msg;
		try {
			msg = JSON.parse(event.data);
		} catch (error) {
			// TODO gracefull report
			return;
		}

		if (msg.type === 'singleItemPost') {
			store.dispatch('feed/saveItem', msg);
		} else {
			// TODO gracefull report
			// console.warn('Uknonwn message type', msg);
		}
	};
};

export default function (ctx) {
	window.addEventListener('message', context(ctx));
};
