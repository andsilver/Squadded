<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout
			column
			justify-center
			align-center
		>
			<div class="full-width">
				<span v-if="!items.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
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
	},
};
</script>
<style lang="stylus">
	.topBar
		position sticky
		top 0
		z-index 5
</style>
