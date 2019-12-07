<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout>
			<Preloader v-if="!squadders" ref="preloader" class="mt-8" />
			<span v-else-if="!squadders.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
			<Feed v-else ref="feed-layout" :items="squadders" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import { prefetch } from '~/helpers';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader.vue';
import TopBar from '~/components/common/TopBar.vue';
import { ActivityStore } from '~/store/activity';

const activities = createNamespacedHelpers(ActivityStore).mapState;

export default {
	name: 'SquaddersPage',
	components: {
		Feed,
		Preloader,
		TopBar,
	},
	computed: {
		...activities([
			'squadders',
		]),
		...mapState([
			'socket',
		]),
	},
	created () {
		prefetch({
			store: this.$store,
			type: 'fetchSquadders',
		});
	},
};
</script>

<style lang="stylus">
.container.layout-padding
	padding 40px 0 0 0
	.layout
		padding 12px
</style>
