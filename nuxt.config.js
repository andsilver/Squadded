const {
	WS_LINK,
	BASE,
	FEED_STORE_LIMIT = 100,
	FB_APP_ID,
} = process.env;

if (!WS_LINK) {
	throw new Error('WS_LINK environment variable is required!');
}

if (!BASE) {
	throw new Error('BASE environment variable is required!');
}

if (!FB_APP_ID) {
	throw new Error('FB_APP_ID environment variable is required!');
}

export default {
	mode: 'spa',
	env: {
		FB_APP_ID,
		FEED_STORE_LIMIT,
		WS_LINK,
	},
	/*
	** Headers of the page
	*/
	head: {
		titleTemplate: '%s - ' + process.env.npm_package_name,
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
					'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
			},
		],
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
		'~/assets/style/app.styl',
	],
	router: {
		base: BASE,
		middleware: [
			'checkAuth',
			'i18n',
		],
	},
	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		'@plugins/i18n',
		'@plugins/vuetify',
		'@plugins/messaging',
		'@plugins/init/restoreFeed',
		{ src: '@plugins/init/ws', ssr: false },
	],
	/*
	** Nuxt.js modules
	*/
	modules: [
		'@nuxtjs/vuetify',
		'@nuxtjs/pwa',
		'@nuxtjs/eslint-module',
	],
	/*
	** Build configuration
	*/
	build: {
		/*
		** You can extend webpack config here
		*/
		extend(config, ctx) {
			config.output.publicPath = './_nuxt/';
			return config;
		},
	},
};
