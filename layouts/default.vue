<template>
	<v-app>
		<v-content :class="{ flex: socket.isPendingAuth }">
			<logo />
			<v-container :class="{ flex: socket.isPendingAuth }">
				<nuxt ref="main-content" />
				<!-- <div v-else-if="merchant.forbidden">
					{{ $t('Forbidden') }}
				</div> -->
				<Preloader v-if="socket.isPendingAuth"  ref="preloader" />
			</v-container>
			<TabBar v-if="showTabs" ref="tab-bar" />
		</v-content>
	</v-app>
</template>

<style lang="stylus">
.v-content
	padding-bottom 48px !important
.v-content.flex .v-content__wrap,
.container.flex
	display flex
	flex-direction column
</style>

<script>
import { mapState } from 'vuex';
import Logo from '~/components/Logo.vue';
import Preloader from '~/components/Preloader.vue';
import TabBar from '~/components/TabBar.vue';
import { isHome } from '~/helpers';

export default {
	components: {
		Logo,
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
