import { API_ENDPOINT } from '~/config';
import { onAuth } from '~/helpers';

const COMMUNITY_ENDPOINT = `${API_ENDPOINT}/community`;

export const fetchUser = async (userId) => {
	try {
		const response = await fetch(`${COMMUNITY_ENDPOINT}/user/${userId}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
		return null;
	}
};

export const guestLogin = async (store) => {
	try {
		const response = await fetch(`${API_ENDPOINT}/auth/guest`, {
			method: 'POST',
		});
		const { token } = await response.json();
		window.postMessage(JSON.stringify({
			type: 'loggedIn',
			userToken: token,
			guest: true,
		}), window.origin);
		await onAuth(store);
		return true;
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
		return false;
	}
};
