import path from 'path';
import fs from 'fs';
import colors from 'vuetify/es5/util/colors';

const {
	API_ENDPOINT,
	BASE,
	FB_APP_ID,
	FEED_STORE_LIMIT,
	IG_CLIENT_ID,
	USE_SSL,
	WS_LINK,
	GTAG_ID,
	SENTRY_KEY,
	SENTRY_PROJECT_ID,
	FULLSTORY_ENABLE,
	NO_MINIFY,
	GOOGLE_CLIENT_ID,
} = process.env;

if (!BASE) {
	throw new Error('BASE environment variable is required!');
}

if (!FB_APP_ID) {
	throw new Error('FB_APP_ID environment variable is required!');
}

if (!IG_CLIENT_ID) {
	throw new Error('IG_CLIENT_ID environment variable is required!');
}

if (!GOOGLE_CLIENT_ID) {
	throw new Error('GOOGLE_CLIENT_ID environment variable is required!');
}

const server = USE_SSL === 'true' ? {
	https: {
		key: fs.readFileSync(path.resolve(__dirname, './dev/server.key')),
		cert: fs.readFileSync(path.resolve(__dirname, './dev/server.crt')),
	},
} : null;

const modules = [
	'@nuxtjs/vuetify',
	'@nuxtjs/pwa',
	'@nuxtjs/eslint-module',
];

if (GTAG_ID) {
	modules.push([
		'@nuxtjs/google-gtag',
		{
			id: GTAG_ID,
		},
	]);
}

const plugins = [
	'@plugins/i18n',
	'@plugins/messaging',
	{ src: '@plugins/init/ws', ssr: false },
	{ src: '@plugins/init/restoreFeed', ssr: false },
	'@plugins/visibility',
	'@plugins/touch-events',
	'@plugins/image-uploader',
	'@plugins/anime',
];

if (SENTRY_KEY && SENTRY_PROJECT_ID) {
	plugins.push('@plugins/sentry');
}

const script = [{
	type: 'text/javascript',
	src: `${BASE}vendor/moment.fr.min.js`,
}];

if (FULLSTORY_ENABLE) {
	script.push({
		type: 'text/javascript',
		src: 'scripts/fullstory.js',
	});
}

export default {
	mode: 'spa',
	env: {
		API_ENDPOINT,
		FB_APP_ID,
		FEED_STORE_LIMIT,
		IG_CLIENT_ID,
		WS_LINK,
		GTAG_ID,
		SENTRY_KEY,
		SENTRY_PROJECT_ID,
		GOOGLE_CLIENT_ID,
	},
	/*
	** Headers of the page
	*/
	head: {
		titleTemplate: '%s',
		title: process.env.npm_package_name || '',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{
				rel: 'stylesheet',
				href:
				'https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap',
			},
		],
		script,
	},
	/*
	** Customize the progress-bar color
	*/
	loading: {
		loading: false,
	},
	/*
	** Global CSS
	*/
	css: [
		'~/assets/style/sqdi.css',
		'~/assets/style/app.styl',
	],
	vuetify: {
		treeShake: true,
		customVariables: ['~/assets/style/variables.scss'],
		theme: {
			dark: false,
			themes: {
				light: {
					primary: '#202020',
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3,
					red: '#D0021B',
				},
			},
		},
	},
	router: {
		base: BASE,
		middleware: [
			'checkAuth',
			'i18n',
		],
		mode: 'abstract',
	},
	server,
	/*
	** Plugins to load before mounting the App
	*/
	plugins,
	/*
	** Nuxt.js modules
	*/
	modules,
	/*
	** Build configuration
	*/
	build: {
		/*
		** You can extend webpack config here
		*/
		extend(config, ctx) {
			config.output.publicPath = `${BASE}_nuxt/`;
			config.optimization.minimize = !NO_MINIFY;
			return config;
		},
	},
	generate: {
		devtools: true,
		minify: !NO_MINIFY,
	},
	vue: {
		config: {
			devtools: true,
		},
	},
};
