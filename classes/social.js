import { API_ENDPOINT } from '~/config';

function extractNonWorkingDestruct() {
	const FB_APP_ID = process.env.FB_APP_ID;
	const IG_CLIENT_ID = process.env.IG_CLIENT_ID;
	const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

	return {
		FB_APP_ID,
		IG_CLIENT_ID,
		GOOGLE_CLIENT_ID,
	};
}

const { FB_APP_ID, IG_CLIENT_ID, GOOGLE_CLIENT_ID } = extractNonWorkingDestruct();

const AUTH_REDIRECT_ROOT = `${API_ENDPOINT}/auth/`;

const OAUTH = {
	facebook: {
		endpoint: 'https://www.facebook.com/v3.3/dialog/oauth?',
		id: FB_APP_ID,
		scope: 'public_profile,email,user_friends',
		display: 'popup',
	},
	instagram: {
		endpoint: 'https://api.instagram.com/oauth/authorize?',
		id: IG_CLIENT_ID,
		scope: 'user_profile',
		display: 'popup',
	},
	google: {
		endpoint: 'https://accounts.google.com/o/oauth2/v2/auth?',
		id: GOOGLE_CLIENT_ID,
		scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
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
			`${providerName === 'google' ? 'client_id' : 'app_id'}=${OAUTH[providerName].id}` +
			`&redirect_uri=${Social.redirectUrl(providerName)}` +
			'&response_type=code' +
			(OAUTH[providerName].scope ? `&scope=${OAUTH[providerName].scope}` : '') +
			(OAUTH[providerName].display ? `&display=${OAUTH[providerName].display}` : '') +
			`&state=${state}`;
		window.open(uri, 'OAuth', 'width=520,height=570');
	}
}
