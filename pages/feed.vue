<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout column>
			<Preloader v-if="loading" ref="preloader" class="mt-8" />
			<span v-else-if="!items.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
			<Feed ref="feed-layout" :items="items" :load-new="loadNew" @loadMore="fetchFeed" @loadNew="() => fetchFeed(true)" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader.vue';
import TopBar from '~/components/common/TopBar.vue';
import { onAuth } from '~/helpers';
import { FeedActions, FeedGetters, FeedStore, FeedMutations } from '~/store/feed';

const feed = createNamespacedHelpers(FeedStore);
const feedGetters = feed.mapGetters;
const feedState = feed.mapState;

export default {
	name: 'FeedPage',
	components: {
		Feed,
		Preloader,
		TopBar,
	},
	data: () => ({
		loadNew: false,
	}),
	computed: {
		...feedGetters([
			FeedGetters.items,
		]),
		...feedState([
			'loading',
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
			if (this.squad.widget.open && (!this.items || !this.items.length)) {
				this.fetchFeed(true);
			} else {
				this.$root.$once('widget-open', () => this.fetchFeed(true));
			}
			if (this.items && this.items.length) {
				this.$store.commit(`${FeedStore}/${FeedMutations.setLoading}`, false);
			}
			setTimeout(() => {
				this.loadNew = true;
			}, 60 * 1000);
		},
		fetchFeed () {
			this.loadNew = false;
			this.$store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
			setTimeout(() => {
				this.$store.commit(`${FeedStore}/${FeedMutations.setLoading}`, false);
			}, 4000);
		},
	},
};
</script>

<style lang="stylus">
.container.layout-padding
	padding 40px 0 0 0
	.layout
		padding 12px
</style>
