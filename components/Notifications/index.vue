<template>
	<section class="feed">
		<template
			v-for="notification in items"
		>
			<component
				:is="getComponent(notification)"
				:key="notification.correlationId || notification.guid"
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
	section
		padding 8px
</style>
