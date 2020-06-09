<template>
	<section class="feed">
		<template
			v-for="notification in items"
		>
			<component
				:is="getComponent(notification)"
				:key="notification.correlationId || notification._id"
				:notification="notification"
			/>
		</template>
	</section>
</template>

<script>
import Comment from './Includes/Comment';
import Like from './Includes/Like';
import PollEnd from './Includes/PollEnd';
import Vote from './Includes/Vote';
import Alert from './Includes/Alert';
import AcceptSquad from './Includes/AcceptSquad';
import InviteSquad from './Includes/InviteSquad';
import Follow from './Includes/Follow';
import FollowRequest from './Includes/FollowRequest';
import { NOTIFICATIONS } from '~/consts/notifications';

export default {
	name: 'NotificationList',
	props: {
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		requests: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		components: {
			[NOTIFICATIONS.COMMENT]: Comment,
			[NOTIFICATIONS.LIKE]: Like,
			[NOTIFICATIONS.POLL_END]: PollEnd,
			[NOTIFICATIONS.VOTE]: Vote,
			[NOTIFICATIONS.ALERT]: Alert,
			[NOTIFICATIONS.ACCEPT_SQUAD]: AcceptSquad,
			[NOTIFICATIONS.INVITE_SQUAD]: InviteSquad,
			[NOTIFICATIONS.FOLLOW]: Follow,
			[NOTIFICATIONS.FOLLOW_REQUEST]: FollowRequest,
		},
	}),
	methods: {
		getComponent (notification) {
			if (
				!this.requests &&
				notification.type !== NOTIFICATIONS.INVITE_SQUAD
			) {
				return this.components[notification.type];
			} else if (this.requests) {
				return this.components[notification.type];
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.feed
	width 100%
	margin-top 3.69vw
	overflow-y auto
	section.text-section
		padding 2.46vw
		border 0.15vw solid #f5f5f5
		border-bottom 0px
		font-size 3.38vw
		line-height 4.5vw
</style>
