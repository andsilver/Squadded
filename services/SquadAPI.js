export const SquadAPI = {
	postItem (item) {
		const message = JSON.stringify({
			type: 'singleItemPost',
			item,
		});

		window.parent.postMessage(message, '*');
	},
	openProduct (item) {
		const { itemId, url, varId } = item;
		window.parent.postMessage(JSON.stringify({
			itemId,
			type: 'openProduct',
			url,
			varId: varId || '',
		}), '*');
	},
};
