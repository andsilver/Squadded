<template>
	<v-app>
		<v-content :class="{ flex: socket.isPendingAuth }">
			<v-container :class="{ flex: socket.isPendingAuth }">
				<nuxt ref="main-content" />
				<Preloader v-if="socket.isPendingAuth" ref="preloader" />
			</v-container>
		</v-content>
		<v-footer absolute padless>
			<TabBar v-if="showTabs" ref="tab-bar" />
		</v-footer>
	</v-app>
</template>

<style lang="stylus">
html
	overflow-y unset !important
.v-application--wrap
	max-height 100vh
	.v-application--wrap
		min-height unset
.v-content
	padding-bottom 48px !important
	max-height 100%
.v-content__wrap
	overflow auto
.v-content.flex .v-content__wrap,
.container.flex
	display flex
	flex-direction column
</style>

<script>
import { mapState } from 'vuex';
import Preloader from '~/components/Preloader.vue';
import TabBar from '~/components/TabBar.vue';
import { isHome } from '~/helpers';

export default {
	components: {
		Preloader,
		TabBar,
	},
	data: () => ({
		title: 'Squad Widget',
	}),
	computed: {
		...mapState([
			'socket',
		]),
		showTabs () {
			return !isHome(this.$route.name);
		},
	},
};
</script>
