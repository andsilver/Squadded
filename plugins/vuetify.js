import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader version "^2.1.1" ,
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify);

export default ({ app }) => {
	app.vuetify = new Vuetify({
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
				},
			},
		},
	});
};
