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
	},
	methods: {
		getComponent (notification) {
			switch (notification.type) {
			case NOTIFICATIONS.COMMENT:
				return Comment;
			case NOTIFICATIONS.LIKE:
				return Like;
			case NOTIFICATIONS.POLL_END:
				return PollEnd;
			case NOTIFICATIONS.VOTE:
				return Vote;
			case NOTIFICATIONS.ALERT:
				return Alert;
			case NOTIFICATIONS.ACCEPT_SQUAD:
				return AcceptSquad;
			default:
				return null;
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.feed
	width 100%
	margin-top 3.69vw
	height calc(100vh - 175px)
	overflow-y auto
	section.text-section
		padding 2.46vw
		border 0.15vw solid #f5f5f5
		border-bottom 0px
		font-size 3.38vw
		line-height 4.5vw
</style>
