<template>
	<v-container v-if="socket.isAuth">
		<BackBar ref="goback-button" :title="$t('Notifications')" />
		<Tabs />
		<v-layout class="nofification-layout">
			<div v-if="!exists" ref="empty-notif-text" class="flex-grow-1">
				<h5 class="mt-4 pl-3 d-flex align-center notification-text">
					<span>{{ $t('notify.new') }}</span>
				</h5>
				<EmptyNotification />
			</div>
			<div v-else class="flex-grow-1">
				<h5 v-if="newNotifications.length" class="mt-4 pl-3 d-flex align-center notification-text">
					<span>{{ $t('notify.new') }}</span>
					<span class="badge">{{ newNotifications.length }}</span>
				</h5>
				<Notifications ref="new-notify" :items="newNotifications" />
				<h5 class="pt-2 pl-3 notification-text">
					{{ $t('notify.old') }}
				</h5>
				<Notifications ref="old-notify" :items="oldNotifications" />
			</div>
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Notifications from '~/components/Notifications';
import EmptyNotification from '~/components/Notifications/Includes/EmptyNotification';
import Tabs from '~/components/Notifications/Tabs';
import { NotificationStore, NotificationActions, NotificationGetters } from '~/store/notification';

const notificationStore = createNamespacedHelpers(NotificationStore);
const notifMapGetters = notificationStore.mapGetters;

export default {
	name: 'NotificationsPage',
	components: {
		BackBar,
		Notifications,
		EmptyNotification,
		Tabs,
	},
	data: () => ({
		stayTimeout: null,
	}),
	computed: {
		...notifMapGetters([
			NotificationGetters.newNotifications,
			NotificationGetters.oldNotifications,
		]),
		...mapState([
			'socket',
		]),
		exists() {
			return this.newNotifications.length || this.oldNotifications.length;
		},
	},
	created () {
		this.$root.$emit('notiPageLoad', {});
		this.$store.dispatch(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
	},
	destroyed () {
		this.$store.dispatch(`${NotificationStore}/${NotificationActions.viewNotifications}`, this.newNotifications);
	},
	head: () => ({
		title: 'Notifications-All',
	}),
};
</script>
<style lang="stylus" scoped>
.badge
	font-size 0.7em
	font-weight 600
	line-height 14px
	color #fff
	background-color #fd6256
	border-radius 7px
	min-width 14px
	padding 0 4px
	margin-left 4px
.notification-text
	color #b8b8ba
	font-size 3.38vw
	font-weight 500
</style>
