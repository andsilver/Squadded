<template>
	<v-tabs
		grow
		height="65"
		class="tabs-sec botoom-tab-sec"
		@click.native="(e) => onTabClick(e)"
	>
		<Tab :tab="tabs[0]" :class="{ 'v-tab--active': fakeActiveTab }" @click.native="closeMenu" />
		<Tab v-if="visibleTab('explore')" :tab="tabs[1]" @click.native="closeMenu" />
		<CreateTab v-if="visiblePosts.length > 1" />
		<Tab v-else :tab="postTab" @click.native="closeMenu" />
		<Tab :tab="tabs[2]" @click.native="closeMenu">
			<Badge :value="newRequests.length || newNotifications.length" />
		</Tab>
		<Tab :tab="tabs[3]" @click.native="closeMenu" />
	</v-tabs>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import CreateTab from './CreateTab';
import Tab from './Tab';
import Badge from '~/components/common/Badge';
import { NotificationStore, NotificationGetters } from '~/store/notification';
import { UserStore } from '~/store/user';
import {
	postTab,
	visiblePosts,
	MERCHAND_ADMIN,
} from '~/consts';

const { mapGetters } = createNamespacedHelpers(NotificationStore);
const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		Badge,
		CreateTab,
		Tab,
	},
	data: () => ({
		showCreate: false,
		tabs: [{
			uri: '/all',
			icon: 'sqdi-blank-house',
			text: 'Home',
		}, {
			uri: '/explore',
			icon: 'sqdi-magnifying-glass-finder',
			text: 'Explore',
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
		...userState(['me']),
		...mapGetters([
			NotificationGetters.newRequests,
			NotificationGetters.newNotifications,
		]),
		...mapState([
			'socket',
			'merchant',
		]),
		postTab,
		visiblePosts,
		fakeActiveTab () {
			return this.$route.path === '/feed';
		},
	},
	created () {
		this.$root.$on('notiPageLoad', data => this.onNoticationPage());
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
		visibleTab(tabName) {
			return this.me.userRole === MERCHAND_ADMIN || !this.merchant.hideFeatures.includes(tabName);
		},
	},
};
</script>

<style lang="stylus" scoped>
.badge
	top -5px
	right -2px
@media screen and (max-width 280px)
	.v-tabs
		>>> .tab_text
			bottom 6px
		>>> .tab_icon:before
			margin-bottom 0
</style>
