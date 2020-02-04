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
			<StartWatchingDialog v-if="showStartWatchingDialog" ref="start-watching-dialog" />
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
import { ActivityStore, ActivityActions } from '~/store/activity';

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
	methods: {
		async init() {
			if (localStorage.getItem('visited')) {
				this.showStartWatchingDialog = false;
			} else {
				this.showStartWatchingDialog = true;
				localStorage.setItem('visited', `${Date.now()}`);
			}
			await onAuth(this.$store);
			this.fetchCommunity(true);
			setTimeout(() => {
				this.loadNew = true;
			}, 60 * 1000);
		},
		fetchCommunity(loadNew = false) {
			this.loadNew = false;
			this.$store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, { type: 'community', loadNew });
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
