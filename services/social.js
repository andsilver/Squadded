const { FB_APP_ID } = process.env;

const OAUTH = {
	facebook: {
		endpoint: 'https://www.facebook.com/v3.3/dialog/oauth?',
		id: FB_APP_ID,
		scope: 'public_profile,email',
		display: 'popup',
	},
};

function generateState () {
	return Math.random().toString(36).slice(2);
}

export default class Social {
	static redirectUrl (providerName) {
		return `https://api.squad-shopping.com/auth/${providerName}/callback`;
	}

	static oauth (providerName) {
		if (!OAUTH[providerName]) {
			return;
		}

		const uri = OAUTH[providerName].endpoint +
			`client_id=${OAUTH[providerName].id}` +
			`&redirect_uri=${Social.redirectUrl(providerName)}` +
			`&state=${generateState()}` +
			'&response_type=code' +
			(OAUTH[providerName].scope ? `&scope=${OAUTH[providerName].scope}` : '') +
			(OAUTH[providerName].display ? `&display=${OAUTH[providerName].display}` : '');
		window.open(uri, 'OAuth', 'width=520,height=570');
	}
}
