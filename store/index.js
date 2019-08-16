import feed from './feed';

export const state = () => ({
	locales: ['en'],
	locale: 'en',
});

export const mutations = {
	SET_LANG (state, locale) {
		if (state.locales.includes(locale)) {
			state.locale = locale;
		}
	},
};

export const modules = {
	feed,
};
