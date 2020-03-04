function extractNonWorkingDestruct() {
	const FB_APP_ID = process.env.FB_APP_ID;
	const IG_CLIENT_ID = process.env.IG_CLIENT_ID;
	const API_ENDPOINT = process.env.API_ENDPOINT;

	return {
		FB_APP_ID,
		IG_CLIENT_ID,
		API_ENDPOINT,
	};
}

const { FB_APP_ID, IG_CLIENT_ID, API_ENDPOINT } = extractNonWorkingDestruct();

const AUTH_REDIRECT_ROOT = `${API_ENDPOINT}/auth/`;

const OAUTH = {
	facebook: {
		endpoint: 'https://www.facebook.com/v3.3/dialog/oauth?',
		id: FB_APP_ID,
		scope: 'public_profile,email',
		display: 'popup',
	},
	instagram: {
		endpoint: 'https://api.instagram.com/oauth/authorize?',
		id: IG_CLIENT_ID,
		scope: 'user_profile',
		display: 'popup',
	},
};

export default class Social {
	static redirectUrl (providerName) {
		return `${AUTH_REDIRECT_ROOT}${providerName}/callback`;
	}

	static oauth (providerName, queryParams) {
		if (!OAUTH[providerName]) {
			return;
		}

		const state = queryParams ? JSON.stringify(queryParams) : '';

		const uri = OAUTH[providerName].endpoint +
			`app_id=${OAUTH[providerName].id}` +
			`&redirect_uri=${Social.redirectUrl(providerName)}` +
			'&response_type=code' +
			(OAUTH[providerName].scope ? `&scope=${OAUTH[providerName].scope}` : '') +
			(OAUTH[providerName].display ? `&display=${OAUTH[providerName].display}` : '') +
			`?state=${state}`;
		window.open(uri, 'OAuth', 'width=520,height=570');
	}
}
