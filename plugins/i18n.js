import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '~/locales/en.json';

Vue.use(VueI18n);

export default ({ app, store }) => {
	// Set i18n instance on app
	// This way we can use it in middleware and pages asyncData/fetch
	app.i18n = new VueI18n({
		locale: store.state.locale,
		fallbackLocale: 'en',
		messages: {
			en,
		},
	});

	app.i18n.path = (link) => {
		if (app.i18n.locale === app.i18n.fallbackLocale) {
			return `/${link}`;
		}

		return `/${link}?lang=${app.i18n.locale}`;
	};
};
