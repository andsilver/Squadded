<template>
	<v-app>
		<v-content :class="{ flex: socket.isPendingAuth, 'show-tabs': socket.isAuth }">
			<nuxt ref="main-content" />
			<Preloader v-if="socket.isPendingAuth" ref="preloader" />
			<v-dialog v-if="promptOptions" v-model="showPrompt">
				<Prompt :text="promptOptions.text" @confirm="confirm" @decline="hide" />
			</v-dialog>
		</v-content>
		<v-footer absolute padless>
			<TabBar v-if="socket.isAuth" ref="tab-bar" />
		</v-footer>
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
		]),
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
.v-content.show-tabs
	padding-bottom 65px !important
</style>
