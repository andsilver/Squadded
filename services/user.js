const { API_ENDPOINT } = process.env;
const COMMUNITY_ENDPOINT = `${API_ENDPOINT}/community`;

export const fetchUser = async (userId) => {
	try {
		const response = await fetch(`${COMMUNITY_ENDPOINT}/user/${userId}`);
		const data = response.json();
		return data;
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
		return null;
	}
};
