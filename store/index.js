import activity from './activity';
import feed from './feed';
import notification from './notification';
import post from './post';
import squad from './squad';
import user from './user';
import pairedItem from './paired-item';
import explore from './explore';
import home from './home';

const DEFAULT_COLOR = '#000';
const widgetLocation = location.search || !document.referrer ? new URL(location.href)
	: new URL(document.referrer);

const {
	merchantId: id,
	siteUrl,
	siteTitle,
	squadSLogin = true,
	brandColor = DEFAULT_COLOR,
} = Object.fromEntries(widgetLocation.searchParams.entries());

if (brandColor !== DEFAULT_COLOR) {
	document.documentElement.style.setProperty('--brand-color', brandColor);
}

export const state = () => ({
	locales: ['en', 'fr'],
	locale: 'en',
	socket: {
		isConnected: false,
		isAuth: false,
		isPendingAuth: true,
		reconnectError: false,
		$ws: {
			sendObj: () => {},
		},
		_ws: null,
	},
	merchant: {
		id,
		siteUrl,
		siteTitle,
		squadSLogin,
		brandColor,
	},
});

export const mutations = {
	SET_LANG (state, locale) {
		if (state.locales.includes(locale)) {
			state.locale = locale;
		}
	},
	SOCKET_ONOPEN (state, event) {
		state.socket.isConnected = true;
		state.socket._ws = event.currentTarget;
	},
	jSocket (state, $ws) {
		state.socket.$ws = $ws;
	},
	SOCKET_ONCLOSE (state, event) {
		state.socket.isConnected = false;
	},
	SOCKET_ONERROR (state, event) {
	},
	SOCKET_ONMESSAGE (state, message) {
	},
	SOCKET_RECONNECT (state, event) {
	},
	SOCKET_RECONNECT_ERROR (state, event) {
	},
	SET_MERCHANT_PARAMS (state, msg) {
		const { merchantId, brandColor = state.merchant.brandColor, siteUrl, siteTitle, squadSLogin } = msg;
		state.merchant.id = merchantId;
		state.merchant.siteUrl = siteUrl;
		state.merchant.siteTitle = siteTitle;
		state.merchant.squadSLogin = squadSLogin;
		state.merchant.brandColor = brandColor;
		if (brandColor !== DEFAULT_COLOR) {
			document.documentElement.style.setProperty('--brand-color', brandColor);
		}
	},
	SET_SOCKET_AUTH (state, flag) {
		state.socket.isAuth = flag;
	},
	SET_PENDING (state, flag) {
		state.socket.isPendingAuth = flag;
	},
};

export const modules = {
	activity,
	feed,
	notification,
	post,
	squad,
	user,
	pairedItem,
	explore,
	home,
};

export default {
	state,
	mutations,
	modules,
	strict: false,
};
