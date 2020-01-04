<template>
	<div class="notifications-container">
		<template v-for="(item, n) of notify">
			<v-slide-y-transition v-if="!item.viewed && item.showBanner && getComponent(item)" :key="n">
				<v-card
					class="ma-3 pa-1 d-flex w-100 justify-space-between align-center"
					:elevation="5"
					transition="scroll-y-transition"
				>
					<component :is="getComponent(item)" class="mr-3" :notification="item" :banner="true" />
					<v-icon class="mr-3" x-small @click="viewItem(item)">
						sqdi-close-cross
					</v-icon>
				</v-card>
			</v-slide-y-transition>
		</template>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Comment from './Includes/Comment';
import Like from './Includes/Like';
import PollEnd from './Includes/PollEnd';
import Vote from './Includes/Vote';
import {
	NotificationStore,
	NotificationGetters,
	NotificationMutations,
} from '~/store/notification';

const { mapGetters } = createNamespacedHelpers(NotificationStore);
const notifMapState = createNamespacedHelpers(NotificationStore).mapState;

export default {
	data: () => ({
		components: {
			notifComment: Comment,
			notifLike: Like,
			notifyPollEnd: PollEnd,
			notifVote: Vote,
		},
	}),
	computed: {
		...mapGetters([NotificationGetters.notify]),
		...notifMapState(['notifications']),
	},
	methods: {
		getComponent(notification) {
			return this.components[notification.type] || null;
		},
		viewItem(item) {
			this.$store.commit(
				`${NotificationStore}/${NotificationMutations.view}`,
				item,
			);
		},
	},
};
</script>

<style scoped lang="stylus">
.notifications-container {
	position: fixed;
	z-index: 99;
}

.notification-item {
	img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}
}
</style>
