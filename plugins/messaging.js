let vStore;

export const parseMessage = function (event) {
	let msg;
	try {
		msg = JSON.parse(event.data);
	} catch (error) {
		// TODO gracefull report
		return;
	}

	if (msg.type === 'singleItemPost') {
		vStore.dispatch('feed/saveItem', msg);
	} else {
		// TODO gracefull report
		// console.warn('Uknonwn message type', msg);
	}
};

export default function ({ store }) {
	vStore = store;
	window.addEventListener('message', parseMessage);
};
