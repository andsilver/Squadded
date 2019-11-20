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

export default {
	name: 'NotificationList',
	components: {
		Comment,
		Like,
	},
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
				: null;
		},
	},
};
</script>

<style lang="stylus" scoped>
.feed
	width 100%
</style>
