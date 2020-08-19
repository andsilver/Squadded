<template>
	<v-app ref="app" :class="{ isTouch, 'show-tabs': showTabs }">
		<NotificationsBanner ref="notifications" />
		<v-overlay :absolute="absolute" :opacity="opacity" :value="overlay" :z-index="zIndex" @click.native="overlayClose" />
		<v-main id="main" :class="{'reduce-main': showTabs}" class="d-flex">
			<nuxt ref="main-content" />
			<v-dialog v-if="promptOptions" v-model="showPrompt">
				<Prompt :text="promptOptions.text" @confirm="confirm" @decline="hide" />
			</v-dialog>
		</v-main>
		<v-bottom-navigation v-if="showTabs" class="bottom-tab-section" height="65">
			<TabBar ref="tab-bar" class="tab-bar-section" />
		</v-bottom-navigation>
		<div v-if="socket.isPendingAuth" ref="preloader" class="pending d-flex justify-center align-center">
			<img src="~/assets/img/loading.gif" class="main-loader">
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
import { isTouch } from '~/utils/device-input';
import { tokenExist } from '~/utils/isAuth';
import { VirtualKeyboardDetector } from '~/utils/virtual-keyboard-detector';
import { SquadAPI } from '~/services/SquadAPI';
import { LOADING_TIMEOUT } from '~/consts';

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
		meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1 , maximum-scale=1.0, user-scalable=0' }],
		showPrompt: false,
		promptOptions: null,
		absolute: false,
		opacity: 0.46,
		overlay: false,
		zIndex: 198,
		scrollTop: null,
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
			return this.socket.isAuth && ![
				'select-username',
				'invite-friends',
				'walkthrough',
				'profile-settings',
				'create-outfit',
				'create-photo',
				'create-video',
				'create-upload',
				'create-poll',
				'create-question',
				'my-mysquad',
			].includes(this.$route.name);
		},
		isTouch,
	},
	created () {
		this.$root.$on('prompt', data => this.prompt(data));
		this.$root.$on('overlayToggle', data => this.overlayToggle(data));
		this.$root.$on('overlayOpen', data => this.overlayOpen(data));
		this.$root.$on('overlayClose', data => this.overlayClose(data));
		this.unsubscribe = this.$store.subscribe((mutation) => {
			if (mutation.type === `${SquadStore}/${SquadMutations.setWidgetState}` && mutation.payload === true) {
				this.$root.$emit('widget-open');
			} else if (mutation.type === `${SquadStore}/${SquadMutations.interaction}` && !tokenExist()) {
				this.$router.push('/signin');
			} else if (mutation.type === `${SquadStore}/${SquadMutations.setSquadParams}` && mutation.payload) {
				if (this.socket.isAuth) {
					this.$router.push(this.squad.route);
				}
				if (!tokenExist()) {
					const { name, params } = this.squad.route;

					if (name === 'user-id') {
						this.$router.push({ path: '/', query: { userId: params.id } });
					} else {
						this.$router.push(this.squad.route);
					}
				}
			} else if (mutation.type === `${SquadStore}/${SquadMutations.openPost}` && mutation.payload) {
				this.$router.push(`post/${mutation.payload}#comments`);
			} else if (mutation.type === 'SET_PENDING' && !mutation.payload) {
				this.rendered();
			}
		});
		if (this.isTouch) {
			const vkdetector = new VirtualKeyboardDetector();
			vkdetector.on('virtualKeyboardVisible', () => {
				this.toggleKeyboard(true);
			});
			vkdetector.on('virtualKeyboardHidden', () => {
				this.toggleKeyboard(false);
			});
		}
	},
	mounted () {
		window.addEventListener('beforeunload', () => {
			sessionStorage.setItem('latestPath', this.$route.path);
			sessionStorage.setItem('latestHash', this.$route.hash);
		});
		if (this.isTouch) {
			this.scrollTop = document.body.scrollTop;
			window.requestAnimationFrame(this.checkIsScroll);
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
		overlayToggle (options) {
			this.overlay = !this.overlay;
			SquadAPI.toggleOverlay(this.overlay);
		},
		overlayOpen (options) {
			this.overlay = true;
			SquadAPI.toggleOverlay(this.overlay);
		},
		overlayClose (options) {
			this.overlay = false;
			SquadAPI.toggleOverlay(this.overlay);
		},
		prompt (options) {
			this.promptOptions = options;
			this.showPrompt = true;
		},
		rendered () {
			const { name } = this.$route;
			if (name === 'feed' || name === 'all') {
				setTimeout(SquadAPI.rendered, LOADING_TIMEOUT);
			} else {
				SquadAPI.rendered();
			}
		},
		toggleKeyboard (state) {
			this.squad.virtualKeyboard = state;
		},
		checkIsScroll() {
			window.removeEventListener('touchstart', this.waitTouch);
			const diff = document.body.scrollTop - this.scrollTop;
			if (diff !== 0) {
				this.scrollTop = document.body.scrollTop;
				window.addEventListener('touchstart', this.waitTouch, { once: true });
			}
			window.requestAnimationFrame(this.checkIsScroll);
		},
		touchOnScroll (event) {
			const prevent = event.target.closest('.feed, .choose-items-section');
			if (!prevent) {
				event.target.click();
			}
		},
		waitTouch () {
			window.addEventListener('touchmove', () => {
				window.removeEventListener('touchstart', this.touchOnScroll);
			}, { once: true });
			window.addEventListener('touchend', this.touchOnScroll, { once: true });
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-main
	overflow hidden auto
.reduce-main
	max-height calc(100vh - 65px)
.v-main >>> .v-main__wrap,
.container
	display flex
	flex-direction column

.v-bottom-navigation
	position fixed
	bottom 0
	z-index 201
	transition-property bottom
	transition-duration 0.1s
	.v-application:not(.show-tabs) &
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
	z-index 210
	background-color rgba(255,255,255,0.96) !important
	@media screen and (max-width 280px)
			height 60px !important
.tab-bar-section
	background-color transparent
.main-loader
	width 33%;
</style>
