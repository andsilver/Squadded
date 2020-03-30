<template>
	<v-app ref="app" :class="{ isTouch, 'show-tabs': (showTabs || guestShow) && (!isOnboarding) }">
		<NotificationsBanner ref="notifications" />
		<v-overlay :absolute="absolute" :opacity="opacity" :value="overlay" :z-index="zIndex" @click.native="overlayClose" />
		<v-content id="main" class="d-flex">
			<nuxt ref="main-content" />
			<v-dialog v-if="promptOptions" v-model="showPrompt">
				<Prompt :text="promptOptions.text" @confirm="confirm" @decline="hide" />
			</v-dialog>
		</v-content>
		<v-bottom-navigation v-if="!isOnboarding" class="bottom-tab-section" height="65">
			<TabBar ref="tab-bar" />
		</v-bottom-navigation>
		<div v-if="socket.isPendingAuth" ref="preloader" class="pending d-flex justify-center align-center">
			<img src="~/assets/img/loading.gif">
		</div>
	</v-app>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex';
import Prompt from '~/components/common/Prompt';
import TabBar from '~/components/common/TabBar.vue';
import NotificationsBanner from '~/components/Notifications/Banner.vue';
import { SquadStore, SquadMutations } from '~/store/squad';
import { UserStore } from '~/store/user';
import { isTouch, onToggleKeyboard } from '~/utils/device-input';
import { tokenExist } from '~/utils/isAuth';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	name: 'DefaultLayout',
	components: {
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
		zIndex: 198,
		guestShow: false,
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
			return ['signin', 'invite-friends', 'walkthrough'].includes(this.$route.name);
		},
	},
	created () {
		this.$root.$on('prompt', data => this.prompt(data));
		this.$root.$on('overlayToggle', data => this.overlayToggle(data));
		this.$root.$on('overlayOpen', data => this.overlayOpen(data));
		this.$root.$on('overlayClose', data => this.overlayClose(data));
		this.$root.$on('guestToolbarShow', data => this.guestToolbarShow());
		this.$root.$on('guestToolbarHide', data => this.guestToolbarHide());
		this.unsubscribe = this.$store.subscribe((mutation) => {
			if (mutation.type === `${SquadStore}/${SquadMutations.setWidgetState}` && mutation.payload === true) {
				this.$root.$emit('widget-open');
			} else if (mutation.type === `${SquadStore}/${SquadMutations.interaction}` && !tokenExist()) {
				this.$router.push('/onboarding');
			} else if (mutation.type === `${SquadStore}/${SquadMutations.setSquadParams}` && mutation.payload) {
				if (this.socket.isAuth || !tokenExist()) {
					this.$router.push(this.squad.route);
				}
			} else if (mutation.type === `${SquadStore}/${SquadMutations.openPost}` && mutation.payload) {
				this.$router.push(`post/${mutation.payload}#comments`);
			}
		});
		if (this.isTouch) {
			onToggleKeyboard(this.toggleKeyboard.bind(this));
		}
	},
	destroyed() {
		this.unsubscribe && this.unsubscribe();
	},
	methods: {
		confirm () {
			this.promptOptions.confirm && this.promptOptions.confirm();
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
		guestToolbarShow () {
			this.guestShow = true;
		},
		guestToolbarHide () {
			this.guestShow = false;
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
	z-index 201
	transition-property bottom
	transition-duration 0.1s
	.v-application.isTouch:not(.show-tabs) &
		bottom -65px

.pending
	position fixed
	top 0
	left 0
	width 100%
	height 100%
	background white
	z-index 999

.bottom-tab-section
	z-index 199
</style>
