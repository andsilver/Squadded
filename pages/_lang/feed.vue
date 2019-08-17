<template>
	<v-layout
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
import { createNamespacedHelpers } from 'vuex';
import Feed from '~/components/Feed';

const { mapState } = createNamespacedHelpers('feed');

export default {
	components: {
		'feed': Feed,
	},
	data() {
		return {
		};
	},
	computed: {
		...mapState([
			'items',
		]),
	},
	mounted() {
		// this.$store.dispatch('feed/get');
	},
};
</script>
