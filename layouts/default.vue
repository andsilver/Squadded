<template>
	<v-app>
		<v-content :class="{ flex: socket.isPendingAuth, 'show-tabs': socket.isAuth }">
			<nuxt ref="main-content" />
			<Preloader v-if="socket.isPendingAuth" ref="preloader" />
		</v-content>
		<v-footer absolute padless>
			<TabBar v-if="socket.isAuth" ref="tab-bar" />
		</v-footer>
	</v-app>
</template>

<script>
import { mapState } from 'vuex';
import Preloader from '~/components/Preloader.vue';
import TabBar from '~/components/common/TabBar.vue';

export default {
	name: 'DefaultLayout',
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
	},
};
</script>

<style lang="stylus" scoped>
.v-content.show-tabs
	padding-bottom 65px !important
</style>
