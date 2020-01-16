<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout>
			<Preloader v-if="!squadders" ref="preloader" class="mt-8" />
			<span v-else-if="!squadders.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
			<Feed
				v-else
				ref="feed-layout"
				:items="squadders"
				:load-new="loadNew"
				@loadMore="fetchSquadders"
				@loadNew="() => fetchSquadders(true)"
			/>
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader.vue';
import TopBar from '~/components/common/TopBar.vue';
import { onAuth } from '~/helpers';
import { ActivityStore, ActivityActions } from '~/store/activity';

const activities = createNamespacedHelpers(ActivityStore).mapState;

export default {
	name: 'SquaddersPage',
	components: {
		Feed,
		Preloader,
		TopBar,
	},
	data: () => ({
		loadNew: false,
	}),
	computed: {
		...activities([
			'squadders',
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
			await onAuth(this.$store);
			this.fetchSquadders(true);
			setTimeout(() => {
				this.loadNew = true;
			}, 60 * 1000);
		},
		fetchSquadders(loadNew = false) {
			this.loadNew = false;
			this.$store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, { type: 'squadders', loadNew });
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
