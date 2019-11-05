export const SquadAPI = {
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
