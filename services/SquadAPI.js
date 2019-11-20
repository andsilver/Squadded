const { API_ENDPOINT } = process.env;

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
	async fetchStreet (merchantId) {
		try {
			const response = await fetch(`${API_ENDPOINT}/community/street?merchantId=${merchantId}`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
};
