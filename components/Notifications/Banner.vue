<template>
	<div class="notifications-container">
		<template v-for="(item, n) of notify">
			<v-slide-y-transition v-if="!item.viewed && item.showBanner && getComponent(item)" :key="n">
				<v-card
					class="d-flex w-100 justify-space-between align-center notification-message"
					:elevation="5"
					transition="scroll-y-transition"
				>
					<component :is="getComponent(item)" class="mr-0" :notification="item" :banner="true" />
					<v-icon color="#B8B8BA" x-small @click="viewItem(item)">
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
import Alert from './Includes/Alert';
import AcceptSquad from './Includes/AcceptSquad';
import Follow from './Includes/Follow';
import FollowRequest from './Includes/FollowRequest';
import {
	NotificationStore,
	NotificationGetters,
	NotificationMutations,
} from '~/store/notification';
import { NOTIFICATIONS } from '~/consts/notifications';

const { mapGetters } = createNamespacedHelpers(NotificationStore);

export default {
	data: () => ({
		components: {
			[NOTIFICATIONS.COMMENT]: Comment,
			[NOTIFICATIONS.LIKE]: Like,
			[NOTIFICATIONS.POLL_END]: PollEnd,
			[NOTIFICATIONS.VOTE]: Vote,
			[NOTIFICATIONS.ALERT]: Alert,
			[NOTIFICATIONS.ACCEPT_SQUAD]: AcceptSquad,
			[NOTIFICATIONS.FOLLOW]: Follow,
			[NOTIFICATIONS.FOLLOW_REQUEST]: FollowRequest,
		},
	}),
	computed: {
		...mapGetters([NotificationGetters.notify]),
	},
	methods: {
		getComponent (notification) {
			return this.components[notification.type];
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
.notifications-container
	position fixed
	z-index 99
	width 100%
	.notification-message
		margin 0 3.07vw
		padding 2.30vw 3.07vw
		border-radius 0
		border-bottom-left-radius 20px
		border-bottom-right-radius 20px
		&::after
			content ''
			position absolute
			width calc(100% - 6vw)
			height 0.76vw
			background-color #ee5f53
			bottom -0.32vw
			border-radius 0 0 3.07vw 3.07vw
.notification-item {
	img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}
}
</style>
