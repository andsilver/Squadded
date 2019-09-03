const {
	// API_LINK,
	WS_LINK,
	BASE,
} = process.env;

if (!WS_LINK) {
	throw new Error('WS_LINK environment variable is required!');
}

if (!BASE) {
	throw new Error('BASE environment variable is required!');
}

/* if (!API_LINK) {
	throw new Error('API_LINK environment variable is required!');
} */

export default {
	mode: 'spa',
	env: {
		WS_LINK,
		// API_LINK,
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
	loading: { color: '#fff' },
	/*
	** Global CSS
	*/
	css: [
		'~/assets/style/app.styl',
	],
	router: {
		base: BASE,
		middleware: 'i18n',
	},
	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		'@plugins/i18n',
		'@plugins/vuetify',
		'@plugins/messaging',
		{ src: '@plugins/ws', ssr: false },
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
	generate: {
		routes: ['/', '/feed'],
	},
};
