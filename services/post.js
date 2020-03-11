import { API_ENDPOINT } from '~/config';

const COMMUNITY_ENDPOINT = `${API_ENDPOINT}/community`;

export const fetchPost = async (postId) => {
	try {
		const response = await fetch(`${COMMUNITY_ENDPOINT}/post/${postId}`);
		const data = response.json();
		return data;
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
		return null;
	}
};
