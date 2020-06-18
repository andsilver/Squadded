import { API_ENDPOINT } from '~/config';

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
			console.error(error); // eslint-disable-line no-console
			return false;
		}
	},
	rendered() {
		window.parent.postMessage(JSON.stringify({
			type: 'rendered',
		}), '*');
	},
	toggleOverlay(state) {
		window.parent.postMessage(JSON.stringify({
			type: 'toggleOverlay',
			state,
		}), '*');
	},
};
