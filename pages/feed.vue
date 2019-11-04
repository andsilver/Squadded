<template>
	<v-container v-if="isVisible" class="layout-padding">
		<TopBar ref="top-bar" />
		<v-layout
			column
			justify-center
			align-center
		>
			<div class="full-width">
				<Feed ref="feed-layout" :items="items" />
			</div>
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import TopBar from '~/components/common/TopBar.vue';

const { mapGetters } = createNamespacedHelpers('feed');

export default {
	name: 'FeedPage',
	components: {
		Feed,
		TopBar,
	},
	computed: {
		...mapGetters([
			'items',
		]),
		...mapState([
			'socket',
		]),
		isVisible () {
			return !this.socket.isPendingAuth && this.socket.isAuth;
		},
	},
	mounted() {
		if (this.socket.isAuth) {
			this.$store.commit('SET_PENDING', false);
		}
	},
};
</script>
