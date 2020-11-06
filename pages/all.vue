<template>
	<v-container v-if="socket.isAuth" ref="main" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout column>
			<Preloader v-if="!posts" ref="preloader" class="mt-8" />
			<span v-else-if="!posts.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
			<Feed
				v-else
				ref="feed-layout"
				:items="posts"
				:load-new="loadNew"
				@loadMore="fetchHome"
				@loadNew="() => fetchHome(true)"
			/>
			<Preloader v-if="posts && loading" ref="preloader-more" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader';
import TopBar from '~/components/common/TopBar';
import { onAuth } from '~/helpers';
import { HomeStore, HomeActions } from '~/store/home';
import {
	HOME_NEW_POSTS_INTERVAL,
	NEW_POSTS_DISAPPEAR_TIMEOUT,
} from '~/consts';

const homeState = createNamespacedHelpers(HomeStore).mapState;

export default {
	name: 'AllPage',
	components: {
		Feed,
		Preloader,
		TopBar,
	},
	data: () => ({
		loadNew: false,
		firstVisit: false,
		timeout: null,
	}),
	computed: {
		...mapState([
			'socket',
			'user',
		]),
		...homeState([
			'posts',
			'loading',
		]),
	},
	created () {
		this.init();
	},
	methods: {
		async init() {
			if (!this.$store.state.user.me.nameSelected) {
				this.firstVisit = true;
				return this.$router.push('/walkthrough');
			}
			await onAuth(this.$store);
			if (this.posts && this.posts.length) {
				return;
			}
			this.fetchHome(true);
		},
		fetchHome(loadNew = false) {
			this.loadNew = false;
			this.$store.dispatch(`${HomeStore}/${HomeActions.fetch}`, loadNew);
			if (loadNew) {
				this.setNewPostsTimeout();
			}
		},
		setNewPostsTimeout() {
			if (this.timeout) {
				clearTimeout(this.timeout);
			}
			this.timeout = setTimeout(() => {
				this.loadNew = true;
				setTimeout(() => (this.loadNew = false), NEW_POSTS_DISAPPEAR_TIMEOUT);
			}, HOME_NEW_POSTS_INTERVAL);
		},
	},
	head: () => ({
		title: 'Feed-Home',
	}),
};
</script>

<style lang="stylus" scoped>
.container.layout-padding
	background #ececec
	padding 40px 0 0 0

	.layout
		padding 8px 2px
</style>
