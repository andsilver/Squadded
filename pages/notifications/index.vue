<template>
	<v-container v-if="socket.isAuth">
		<BackBar ref="goback-button" :title="$t('Notifications')" />
		<Tabs />
		<v-layout class="nofification-layout">
			<span v-if="!exists" ref="empty-notif-text">{{ $t('notify.isEmpty') }}</span>
			<div v-else class="flex-grow-1">
				<h5 v-if="newNotify.length" class="mt-4 pl-3 d-flex align-center">
					<span>{{ $t('notify.new') }}</span>
					<span class="badge">{{ newNotify.length }}</span>
				</h5>
				<Notifications ref="new-notify" :items="newNotify" />
				<h5 class="pt-2 pl-3">
					{{ $t('notify.old') }}
				</h5>
				<Notifications ref="old-notify" :items="oldNotify" />
			</div>
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Notifications from '~/components/Notifications';
import Tabs from '~/components/Notifications/Tabs';
import { NotificationStore, NotificationActions, NotificationGetters } from '~/store/notification';

const notificationStore = createNamespacedHelpers(NotificationStore);
const notifMapGetters = notificationStore.mapGetters;

export default {
	name: 'NotificationsPage',
	components: {
		BackBar,
		Notifications,
		Tabs,
	},
	data: () => ({
		stayTimeout: null,
	}),
	computed: {
		...notifMapGetters([
			NotificationGetters.newNotify,
			NotificationGetters.oldNotify,
		]),
		...mapState([
			'socket',
		]),
		exists() {
			return this.newNotify.length || this.oldNotify.length;
		},
	},
	created () {
		this.$root.$emit('notiPageLoad', {});
		this.$store.dispatch(`${NotificationStore}/${NotificationActions.fetchNotifications}`);
	},
	destroyed () {
		this.$store.dispatch(`${NotificationStore}/${NotificationActions.viewNotifications}`);
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
</style>
