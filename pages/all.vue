<template>
	<v-container v-if="socket.isAuth" ref="main" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout>
			<Preloader v-if="!community" ref="preloader" class="mt-8" />
			<span v-else-if="!community.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
			<Feed
				v-else
				ref="feed-layout"
				:items="community"
				:load-new="loadNew"
				@loadMore="fetchCommunity"
				@loadNew="() => fetchCommunity(true)"
			/>
			<StartWatchingDialog v-if="firstVisit" ref="start-watching-dialog" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader.vue';
import TopBar from '~/components/common/TopBar.vue';
import StartWatchingDialog from '~/components/Community/StartWatchingDialog';
import { onAuth } from '~/helpers';
import { ActivityStore, ActivityActions, ActivityMutations } from '~/store/activity';
import {
	STORAGE_VISITED_KEY,
	HOME_NEW_POSTS_INTERVAL,
	NEW_POSTS_DISAPPEAR_TIMEOUT,
} from '~/consts';

const activities = createNamespacedHelpers(ActivityStore).mapState;

export default {
	name: 'AllPage',
	components: {
		Feed,
		Preloader,
		TopBar,
		StartWatchingDialog,
	},
	data: () => ({
		loadNew: false,
		firstVisit: false,
		timeout: null,
	}),
	computed: {
		...activities([
			'community',
		]),
		...mapState([
			'socket',
		]),
	},
	created () {
		this.init();
	},
	destroyed() {
		this.$store.commit(`${ActivityStore}/${ActivityMutations.clearCommunity}`);
	},
	methods: {
		async init() {
			if (!localStorage.getItem(STORAGE_VISITED_KEY)) {
				this.firstVisit = true;
			}
			await onAuth(this.$store);
			if (this.community && this.community.length) {
				return;
			}
			this.fetchCommunity(true);
		},
		fetchCommunity(loadNew = false) {
			this.loadNew = false;
			this.$store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
				type: 'community',
				loadNew,
			});
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

<style lang="stylus">
.container.layout-padding
	padding 40px 0 0 0
	.layout
		padding 12px
</style>
