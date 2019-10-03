<template>
	<v-layout
		v-if="isVisible"
		ref="feed-layout"
		column
		justify-center
		align-center
	>
		<div class="full-width">
			<feed :items="items" />
		</div>
	</v-layout>
</template>

<style lang="stylus">
.full-width {
	width 100%
	margin-left 0
	margin-right 0
}
.social {
	display flex
	justify-content space-between

	span {
		line-height 50px
	}
}
</style>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';

const { mapGetters } = createNamespacedHelpers('feed');

export default {
	components: {
		'feed': Feed,
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
