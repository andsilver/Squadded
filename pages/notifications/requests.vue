<template>
	<v-container v-if="socket.isAuth">
		<BackBar ref="goback-button" :title="$t('Notifications')" />
		<Tabs />
		<v-layout class="nofification-layout">
			<div v-if="!filtered.length" class="flex-grow-1">
				<h5 ref="empty-notif-text" class="mt-4 pl-3 d-flex align-center notification-text">
					<span>{{ $t('notify.new') }}</span>
				</h5>
				<EmptyNotification />
			</div>
			<Notifications v-else ref="notification-list" is-accept :items="filtered" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Notifications from '~/components/Notifications';
import Tabs from '~/components/Notifications/Tabs';
import EmptyNotification from '~/components/Notifications/Includes/EmptyNotification';
import { NotificationStore, NotificationActions } from '~/store/notification';
import { NOTIFICATIONS } from '~/consts/notifications';

const notifStore = createNamespacedHelpers(NotificationStore);
const notifState = notifStore.mapState;
const notifGetters = notifStore.mapGetters;

export default {
	name: 'NotificationsPage',
	components: {
		BackBar,
		Notifications,
		EmptyNotification,
		Tabs,
	},
	computed: {
		...notifState(['notifications']),
		...notifGetters(['newRequests']),
		...mapState(['socket']),
		filtered() {
			return this.notifications.filter(
				n => n.type === NOTIFICATIONS.ACCEPT_SQUAD || (n.type === NOTIFICATIONS.INVITE_SQUAD && (!n.denied && !n.accepted)),
			);
		},
	},
	destroyed () {
		this.$store.dispatch(`${NotificationStore}/${NotificationActions.viewNotifications}`, this.newRequests);
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
.notification-text
	color #b8b8ba
	font-size 3.38vw
	font-weight 500
</style>
