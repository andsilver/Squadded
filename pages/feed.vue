<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout>
			<Preloader v-if="loading" ref="preloader" class="mt-8" />
			<span v-else-if="!items.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
			<Feed v-else ref="feed-layout" :items="items" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader.vue';
import TopBar from '~/components/common/TopBar.vue';
import { onAuth } from '~/helpers';
import { FeedActions, FeedGetters, FeedStore } from '~/store/feed';

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
		onOpen () {
			if (this.squad.widget.open && (!this.items || !this.items.length)) {
				this.fetchFeed();
			} else {
				this.$root.$once('widget-open', () => this.fetchFeed());
			}
		},
		async fetchFeed () {
			await onAuth(this.$store);
			this.$store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
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
