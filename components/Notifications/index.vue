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
			return notification.type === 'notifComment' ? Comment
				: notification.type === 'notifLike' ? Like
				: notification.type === 'notifyPollEnd' ? PollEnd
				: notification.type === 'notifVote' ? Vote
				: null;
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
