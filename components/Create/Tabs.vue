<template>
	<v-toolbar
		v-if="visiblePosts.length > 1"
		dense
		flat
		height="40"
		class="px-3"
	>
		<v-tabs fixed-tabs>
			<v-tab
				v-for="tab in visiblePosts"
				:key="tab.uri"
				:to="tab.uri"
				color="#000"
			>
				{{ $t(tab.title) }}
			</v-tab>
		</v-tabs>
	</v-toolbar>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import { visiblePosts } from '~/consts';
import { UserStore } from '~/store/user';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	computed: {
		...userState(['me']),
		...mapState([
			'merchant',
		]),
		visiblePosts,
	},
};
</script>

<style lang="stylus" scoped>
.v-toolbar
	flex-grow 0
	.v-tab
		font-size: 3.733vw !important;
		font-weight: 600 !important;
		border-bottom: 1.2px solid #B8B8BA !important;
		min-width initial
		&--active
			border-bottom: 1.5px solid #202020;
		&:not(.v-tab--active)
			color #B8B8BA !important

</style>
