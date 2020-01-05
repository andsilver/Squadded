<template>
	<v-container v-if="socket.isAuth">
		<BackBar ref="goback-button" :title="$t('Notifications')" />
		<Tabs />
		<v-layout class="nofification-layout">
			<span v-if="!notifications.length" ref="empty-notif-text">{{ $t('notify.isEmpty') }}</span>
			<Notifications v-else ref="notification-list" :items="notifications" />
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import { prefetch } from '~/helpers';
import BackBar from '~/components/common/BackBar';
import Notifications from '~/components/Notifications';
import Tabs from '~/components/Notifications/Tabs';
import { NotificationStore, NotificationMutations } from '~/store/notification';

const notifMapState = createNamespacedHelpers(NotificationStore).mapState;

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
<style lang="stylus" scoped>
.layout.nofification-layout
	margin-left -12px
	margin-right -12px
</style>
