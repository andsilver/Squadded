<template>
	<v-app ref="app" :class="{ isTouch, 'show-tabs': showTabs }">
		<NotificationsBanner ref="notifications" />
		<v-overlay :absolute="absolute" :opacity="opacity" :value="overlay" :z-index="zIndex" @click.native="overlayClose" />
		<v-content id="main" class="d-flex">
			<nuxt ref="main-content" />
			<Preloader v-if="socket.isPendingAuth" ref="preloader" />
			<v-dialog v-if="promptOptions" v-model="showPrompt">
				<Prompt :text="promptOptions.text" @confirm="confirm" @decline="hide" />
			</v-dialog>
		</v-content>
		<v-bottom-navigation v-if="!isOnboarding" height="65">
			<TabBar ref="tab-bar" />
		</v-bottom-navigation>
	</v-app>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex';
import Preloader from '~/components/Preloader.vue';
import Prompt from '~/components/common/Prompt';
import TabBar from '~/components/common/TabBar.vue';
import NotificationsBanner from '~/components/Notifications/Banner.vue';
import { SquadStore, SquadMutations, DEFAULT_LANDING } from '~/store/squad';
import { UserStore, UserMutations } from '~/store/user';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { isTouch, onToggleKeyboard } from '~/utils/device-input';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	name: 'DefaultLayout',
	components: {
		Preloader,
		Prompt,
		TabBar,
		NotificationsBanner,
	},
	data: () => ({
		title: 'Squad Widget',
		showPrompt: false,
		promptOptions: null,
		absolute: false,
		opacity: 0.46,
		overlay: false,
		zIndex: 11,
		firstTime: true,
	}),
	computed: {
		...mapState([
			'socket',
			'squad',
		]),
		...userState([
			'me',
		]),
		showTabs () {
			return this.socket.isAuth && (!this.isTouch || !this.squad.virtualKeyboard);
		},
		isTouch,
		isOnboarding () {
			return this.$route.name === 'onboarding';
		},
	},
	created () {
		this.$root.$on('prompt', data => this.prompt(data));
		this.$root.$on('overlayToggle', data => this.overlayToggle(data));
		this.$root.$on('overlayOpen', data => this.overlayOpen(data));
		this.$root.$on('overlayClose', data => this.overlayClose(data));
		this.unsubscribe = this.$store.subscribe((mutation) => {
			if (mutation.type === `${SquadStore}/${SquadMutations.setWidgetState}` && mutation.payload === true) {
				this.$root.$emit('widget-open');
			}
			if (mutation.type === `${UserStore}/${UserMutations.setToken}`) {
				const user = this.me;
				if (!user.nameSelected) {
					this.$router.push('/select-username');
					return;
				}
				if (!user.squaddersCount) {
					this.$router.push('/create-your-squad');
					return;
				}
				this.$router.push(DEFAULT_LANDING);
			}
			if (mutation.type === `${ActivityStore}/${ActivityMutations.addPost}` && !this.socket.isAuth) {
				this.$router.push('/onboarding');
			}
		});
		if (this.isTouch) {
			onToggleKeyboard(this.toggleKeyboard.bind(this));
		}
		if (this.squad.route.name === 'user-id') {
			this.$router.push(this.squad.route);
		}
	},
	destroyed() {
		this.unsubscribe && this.unsubscribe();
	},
	methods: {
		confirm () {
			this.promptOptions.confirm();
			this.hide();
		},
		hide () {
			this.showPrompt = false;
			this.promptOptions.hide && this.promptOptions.hide();
		},
		prompt (options) {
			this.promptOptions = options;
			this.showPrompt = true;
		},
		toggleKeyboard (state) {
			this.squad.virtualKeyboard = state;
		},
		overlayToggle  (options) {
			if (this.overlay) {
				this.overlay = false;
			} else {
				this.overlay = true;
			}
		},
		overlayOpen (options) {
			this.overlay = true;
		},
		overlayClose (options) {
			this.overlay = false;
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-content
	overflow hidden auto
	.show-tabs &
		padding-bottom 65px !important
.v-content >>> .v-content__wrap,
.container
	display flex
	flex-direction column

.v-bottom-navigation
	position fixed
	bottom 0
	z-index 100
	transition-property bottom
	transition-duration 0.1s
	.v-application.isTouch:not(.show-tabs) &
		bottom -65px
</style>
