import Vue from 'vue';
import { ROOT_EVENTS } from '~/consts';
import { guestLogin } from '~/services/user';

Vue.mixin({
	// computed: {
	// 	isAuth () {
	// 		return this.$isAuth();
	// 	},
	// 	isGuestMode () {
	// 		return this.$isGuestMode();
	// 	},
	// 	isGuest () {
	// 		return this.$isGuest();
	// 	},
	// },
	methods: {
		async checkActionPermission(letGuestLogin = true) {
			if (!this.$isAuth()) {
				if (this.$isGuestMode() && letGuestLogin) {
					return await guestLogin(this.$store);
				} else {
					this.$root.$emit(ROOT_EVENTS.SHOW_SIGNIN_DIALOG, true);
				}
				return false;
			}

			if (this.$isGuest() && !letGuestLogin) {
				this.$root.$emit(ROOT_EVENTS.SHOW_SIGNIN_DIALOG, true);
				return false;
			}
			return true;
		},
	},
});

export default ({ store, app }, inject) => {
	const isAuth = () => store.state.socket.isAuth;
	const isGuestMode = () => store.state.merchant.guest;
	const isGuest = () => (!isAuth() && isGuestMode()) || (isAuth() && store.state.user.me.guest);
	const showSignInDialog = (show = true) => app.router.app.$root.$emit(ROOT_EVENTS.SHOW_SIGNIN_DIALOG, show);

	inject('isAuth', isAuth);
	inject('isGuestMode', isGuestMode);
	inject('isGuest', isGuest);
	inject('showSignInDialog', showSignInDialog);
};
