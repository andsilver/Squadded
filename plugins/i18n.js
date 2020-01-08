import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '~/locales/en.json';
import fr from '~/locales/fr.json';

Vue.use(VueI18n);

export default ({ app, store }) => {
	// Set i18n instance on app
	// This way we can use it in middleware and pages asyncData/fetch
	let locale = navigator.language.split('-')[0];
	['en', 'fr'].includes(locale) || (locale = 'en');

	app.i18n = new VueI18n({
		locale: store.state.locale,
		fallbackLocale: locale,
		messages: {
			en,
			fr,
		},
	});

	app.i18n.path = (link) => {
		if (app.i18n.locale === app.i18n.fallbackLocale) {
			return `/${link}`;
		}

		return `/${link}?lang=${app.i18n.locale}`;
	};
};
