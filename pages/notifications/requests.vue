<template>
	<v-container v-if="socket.isAuth">
		<BackBar ref="goback-button" :title="$t('Notifications')" />
		<Tabs />
		<v-layout class="nofification-layout">
			<span v-if="!notifications.length" ref="empty-notif-text">{{ $t('notify.isEmpty') }}</span>
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
};
</script>
<style lang="stylus" scoped>
.layout.nofification-layout
	margin-left -12px
	margin-right -12px
</style>
