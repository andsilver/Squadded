<template>
	<v-container v-if="socket.isAuth">
		<v-layout>
			<span v-if="!notifications.length" ref="empty-notif-text">{{ $t('notify.isEmpty') }}</span>
			<Notifications v-else ref="notification-list" :items="notifications" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import { prefetch } from '~/helpers';
import Notifications from '~/components/Notifications';
import { NotificationStore, NotificationMutations } from '~/store/notification';

const notifMapState = createNamespacedHelpers(NotificationStore).mapState;

export default {
	name: 'NotificationsPage',
	components: {
		Notifications,
	},
	data: () => ({
		stayTimeout: null,
	}),
	computed: {
		...notifMapState([
			'notifications',
		]),
		...mapState([
			'socket',
		]),
	},
	created () {
		this.stayToView();
		if (this.notifications.length) {
			return;
		}
		prefetch({
			store: this.$store,
			type: 'fetchNotifications',
		});
	},
	destroyed () {
		clearTimeout(this.stayTimeout);
	},
	methods: {
		stayToView () {
			this.stayTimeout = setTimeout(() => {
				this.$store.commit(`${NotificationStore}/${NotificationMutations.viewAll}`);
			}, 5000);
		},
	},
};
</script>
