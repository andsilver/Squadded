let vStore;

export const parseMessage = function (event) {
	let data;
	try {
		data = JSON.parse(event.data);
	} catch (error) {
		// TODO gracefull report
		return;
	}

	if (data.type === 'FEED_ITEM') {
		vStore.dispatch('feed/saveItem', data.item);
	} else {
		// TODO gracefull report
		// console.warn('Uknonwn message type', data);
	}
};

export default function ({ store }) {
	vStore = store;
	window.addEventListener('message', parseMessage);
};
