<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout>
			<span v-if="!items.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
			<Feed v-else ref="feed-layout" :items="items" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import TopBar from '~/components/common/TopBar.vue';
import { onAuth } from '~/helpers';
import { FeedActions, FeedGetters, FeedStore } from '~/store/feed';

const { mapGetters } = createNamespacedHelpers(FeedStore);

export default {
	name: 'FeedPage',
	components: {
		Feed,
		TopBar,
	},
	computed: {
		...mapGetters([
			FeedGetters.items,
		]),
		...mapState([
			'socket',
			'squad',
		]),
	},
	created () {
		this.onOpen();
	},
	methods: {
		async onOpen () {
			await onAuth(this.$store);
			if (this.squad.widget.open) {
				this.fetchFeed();
			}
			this.$root.$on('widget-open', () => this.fetchFeed());
		},
		fetchFeed () {
			this.$store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
		},
	},
};
</script>
<style lang="stylus">
	.topBar
		position sticky
		top 0
		z-index 5
</style>
