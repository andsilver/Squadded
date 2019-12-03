<template>
	<v-app ref="app" :class="{ isTouch, 'show-tabs': showTabs }">
		<v-content id="main" :class="{ 'd-flex': socket.isPendingAuth }">
			<nuxt ref="main-content" />
			<Preloader v-if="socket.isPendingAuth" ref="preloader" />
			<v-dialog v-if="promptOptions" v-model="showPrompt">
				<Prompt :text="promptOptions.text" @confirm="confirm" @decline="hide" />
			</v-dialog>
		</v-content>
		<v-bottom-navigation height="65">
			<TabBar ref="tab-bar" />
		</v-bottom-navigation>
	</v-app>
</template>

<script>
import { mapState } from 'vuex';
import Preloader from '~/components/Preloader.vue';
import Prompt from '~/components/common/Prompt';
import TabBar from '~/components/common/TabBar.vue';
import { SquadStore, SquadMutations } from '~/store/squad';
import { isTouch, onToggleKeyboard } from '~/utils/device-input';

export default {
	name: 'DefaultLayout',
	components: {
		Preloader,
		Prompt,
		TabBar,
	},
	data: () => ({
		title: 'Squad Widget',
		showPrompt: false,
		promptOptions: null,
	}),
	computed: {
		...mapState([
			'socket',
			'squad',
		]),
		showTabs () {
			return this.socket.isAuth && (!this.isTouch || !this.squad.virtualKeyboard);
		},
		isTouch,
	},
	created () {
		this.$root.$on('prompt', data => this.prompt(data));
		this.unsubscribe = this.$store.subscribe((mutation) => {
			if (mutation.type === `${SquadStore}/${SquadMutations.setWidgetState}` && mutation.payload === true) {
				this.$root.$emit('widget-open');
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
			this.promptOptions.confirm();
			this.hide();
		},
		hide () {
			this.showPrompt = false;
			this.promptOptions.hide();
		},
		prompt (options) {
			this.promptOptions = options;
			this.showPrompt = true;
		},
		toggleKeyboard (state) {
			this.squad.virtualKeyboard = state;
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-content
	display: block;
	flex-shrink 1
	overflow hidden scroll
	.show-tabs &
		padding-bottom 65px !important

.v-bottom-navigation
	position fixed
	bottom 0
	z-index 100
	transition-property bottom
	transition-duration 0.1s
	.v-application.isTouch:not(.show-tabs) &
		bottom -65px
</style>
