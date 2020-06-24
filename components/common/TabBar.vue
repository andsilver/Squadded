<template>
	<v-tabs
		grow
		height="65"
		class="tabs-sec botoom-tab-sec"
		@click.native="(e) => onTabClick(e)"
	>
		<Tab :tab="tabs[0]" :class="{ 'v-tab--active': fakeActiveTab }" @click.native="closeMenu" />
		<Tab :tab="tabs[1]" @click.native="closeMenu" />
		<CreateTab />
		<Tab :tab="tabs[2]" @click.native="closeMenu">
			<Badge class="badge" :value="newRequests.length || newNotifications.length" />
		</Tab>
		<Tab :tab="tabs[3]" />
	</v-tabs>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import CreateTab from './CreateTab';
import Tab from './Tab';
import Badge from '~/components/common/Badge';
import { NotificationStore, NotificationGetters } from '~/store/notification';

const { mapGetters } = createNamespacedHelpers(NotificationStore);

export default {
	components: {
		Badge,
		CreateTab,
		Tab,
	},
	data: () => ({
		showCreate: false,
		fakeActiveTab: false,
		// tabs: [{
		// 	uri: '/all',
		// 	icon: 'sqdi-blank-house',
		// 	text: 'Home',
		// }, {
		// 	uri: '/explore',
		// 	icon: 'sqdi-magnifying-glass-finder',
		// 	text: 'Explore',
		// }, {
		// 	uri: '/notifications',
		// 	icon: 'sqdi-notification',
		// 	text: 'Messages',
		// }, {
		// 	uri: '/me',
		// 	icon: 'sqdi-squadded-icon',
		// 	text: 'Profile',
		// }],
		tabs: [{
			uri: '/feed',
			icon: 'sqdi-blank-house',
			text: 'My Squad',
		}, {
			uri: '/all',
			icon: 'sqdi-magnifying-glass-finder',
			text: 'Community',
		}, {
			uri: '/notifications',
			icon: 'sqdi-notification',
			text: 'Messages',
		}, {
			uri: '/me',
			icon: 'sqdi-squadded-icon',
			text: 'Profile',
		}],
	}),
	computed: {
		...mapGetters([
			NotificationGetters.newRequests,
			NotificationGetters.newNotifications,
		]),
		...mapState([
			'socket',
		]),
	},
	created () {
		this.$root.$on('notiPageLoad', data => this.onNoticationPage());
		this.$root.$on('guestToolbarShow', data => this.guestToolbarShow());
	},
	methods: {
		closeMenu () {
			this.$root.$emit('overlayClose', { });
		},
		onTabClick (e) {
			if (!this.socket.isAuth) {
				this.$router.push('/');
			}
		},
		onNoticationPage () {
		},
		guestToolbarShow () {
			this.fakeActiveTab = true;
		},
	},
};
</script>

<style lang="stylus" scoped>
.badge
	top 12px
	left 39px
@media screen and (max-width 280px)
	.v-tabs
		>>> .tab_text
			bottom 6px
		>>> .tab_icon:before
			margin-bottom 0
</style>
