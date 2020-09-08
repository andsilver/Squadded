<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout column class="px-0 squadder-feed">
			<Squadders :users="mysquad" :has-post="!!(items && items.length)" :loading="loading" class="squadder-section" />
			<Preloader v-if="!items" ref="preloader" class="mt-4 mb-4" />
			<template v-else-if="items.length">
				<Feed
					ref="feed-layout"
					:items="items"
					:load-new="newPostsAvailable"
					@loadMore="fetchFeed"
					@loadNew="() => fetchFeed(true)"
				/>
			</template>
			<Preloader v-if="items && loading" ref="preloader-more" class="mt-4 mb-4" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader';
import TopBar from '~/components/common/TopBar';
import Squadders from '~/components/Squadders';
import { onAuth, prefetch } from '~/helpers';
import { FeedActions, FeedGetters, FeedStore, FeedMutations } from '~/store/feed';
import { UserStore } from '~/store/user';
import { NEW_POSTS_DISAPPEAR_TIMEOUT } from '~/consts';

const feed = createNamespacedHelpers(FeedStore);
const userState = createNamespacedHelpers(UserStore).mapState;
const feedGetters = feed.mapGetters;
const feedState = feed.mapState;

export default {
	name: 'FeedPage',
	components: {
		Feed,
		Preloader,
		TopBar,
		Squadders,
	},
	asyncData({ store, redirect }) {
		const { me } = store.state.user;
		if (!me.nameSelected) {
			redirect('/select-username');
		}
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
			'newPostsAvailable',
			'squadders',
		]),
		...mapState([
			'socket',
			'squad',
		]),
		...userState([
			'me',
		]),
		mysquad() {
			return [this.me, ...(this.squadders || [])];
		},
	},
	watch: {
		newPostsAvailable (value) {
			this.setHideNewPostsTimeout();
		},
		squadders (newV, oldV) {
			const newL = newV ? newV.length : 0;
			const oldL = oldV ? oldV.length : 0;
			if (newL !== oldL) {
				this.fetchFeed(true);
			}
		},
	},
	created () {
		this.onOpen();
		this.setHideNewPostsTimeout();
	},
	methods: {
		async onOpen () {
			this.loadingSquadders = true;
			await onAuth(this.$store);
			if (!this.items || !this.items.length) {
				this.fetchFeed(true);
			} else {
				this.$root.$once('widget-open', () => this.fetchFeed(true));
			}
			if (this.items && this.items.length) {
				this.$store.commit(`${FeedStore}/${FeedMutations.setLoading}`, false);
			}
			this.fetchSquadders();
		},
		fetchFeed (loadNew = false) {
			this.$store.dispatch(`${FeedStore}/${FeedActions.fetch}`, loadNew);
		},
		fetchSquadders () {
			prefetch({
				type: 'fetchSquadders',
				store: this.$store,
			});
		},
		setHideNewPostsTimeout() {
			if (this.newPostsAvailable) {
				setTimeout(() => {
					this.$store.commit(`${FeedStore}/${FeedMutations.setNewPostsAvailable}`, false);
				}, NEW_POSTS_DISAPPEAR_TIMEOUT);
			}
		},
	},
	head: () => ({
		title: 'Feed-My Squad',
	}),
};
</script>

<style lang="stylus">
.container.layout-padding
	padding 40px 0 0 0
	.layout
		padding 12px
		&.squadder-feed
			padding-top 0px !important
</style>
