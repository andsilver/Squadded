<template>
	<v-app>
		<v-content id="main" :class="{ 'd-flex': socket.isPendingAuth, 'show-tabs': showTabs }">
			<nuxt ref="main-content" />
			<Preloader v-if="socket.isPendingAuth" ref="preloader" />
			<v-dialog v-if="promptOptions" v-model="showPrompt">
				<Prompt :text="promptOptions.text" @confirm="confirm" @decline="hide" />
			</v-dialog>
		</v-content>
		<v-bottom-navigation v-if="showTabs" height="65">
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
			return this.socket.isAuth && !this.squad.virtualKeyboard;
		},
	},
	created () {
		this.$root.$on('prompt', data => this.prompt(data));
		this.unsubscribe = this.$store.subscribe((mutation) => {
			if (mutation.type === `${SquadStore}/${SquadMutations.setWidgetState}` && mutation.payload === true) {
				this.$root.$emit('widget-open');
			}
		});
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
	},
};
</script>

<style lang="stylus" scoped>
.v-content
	display: block;
	flex-shrink 1
	overflow hidden scroll
	&.show-tabs
		padding-bottom 65px !important

.v-bottom-navigation
	position fixed
	bottom 0
	z-index 100
</style>
