<template>
	<v-app>
		<v-content :class="{ flex: socket.isPendingAuth }">
			<nuxt ref="main-content" />
			<Preloader v-if="socket.isPendingAuth" ref="preloader" />
		</v-content>
		<v-footer absolute padless>
			<TabBar v-if="showTabs" ref="tab-bar" />
		</v-footer>
	</v-app>
</template>

<script>
import { mapState } from 'vuex';
import Preloader from '~/components/Preloader.vue';
import TabBar from '~/components/common/TabBar.vue';
import { isHome } from '~/helpers';

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
		showTabs () {
			return !isHome(this.$route.name);
		},
	},
};
</script>
