<template>
	<v-container v-if="socket.isAuth">
		<BackBar ref="goback-button" :title="$t('Notifications')" />
		<Tabs />
		<v-layout class="nofification-layout">
			<div v-if="!notifications.length" class="empty_feed">
				<p class="feed_img">
					<img src="~assets/img/add-user-black.svg" class="insta-image">
				</p>
				<p ref="empty-notif-text" align="center" class="txt">
					{{ $t('notify.requestEmpty') }}
				</p>
			</div>
			<Notifications v-else ref="notification-list" :items="filtered" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Notifications from '~/components/Notifications';
import Tabs from '~/components/Notifications/Tabs';
import { NotificationStore, NotificationActions } from '~/store/notification';
import { NOTIFICATIONS } from '~/consts/notifications';

const notifMapState = createNamespacedHelpers(NotificationStore).mapState;

export default {
	name: 'NotificationsPage',
	components: {
		BackBar,
		Notifications,
		Tabs,
	},
	computed: {
		...notifMapState([
			'notifications',
		]),
		...mapState([
			'socket',
		]),
		filtered () {
			return this.notifications.filter(n => n.type === NOTIFICATIONS.ACCEPT_SQUAD);
		},
	},
	created () {
		this.$store.dispatch(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
	},
	head: () => ({
		title: 'Notifications-Requests',
	}),
};
</script>
<style lang="stylus" scoped>
.layout.nofification-layout
	margin-left -12px
	margin-right -12px
.empty_feed
	width 82.15vw
	margin 13.38vw auto 0
	text-align center
	.feed_img
		background rgba(218,217,221,0.30)
		width 30.76vw
		height 30.76vw
		display flex
		justify-content center
		align-items center
		border-radius 50%
		margin 0 auto
		img
			width 10.769vw
			height 10.769vw
	.txt
		font-size 3.69vw
		font-weight 500
		color #000
		margin-top 3.69vw
</style>
