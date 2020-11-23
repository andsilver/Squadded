<template>
	<v-tabs
		grow
		height="65"
		class="tabs-sec botoom-tab-sec"
		:class="{ community }"
	>
		<Tab
			ref="home-tab"
			:tab="tabs[0]"
			:class="{ 'v-tab--active': fakeActiveTab }"
			@click.native="closeMenu('home')"
		/>
		<Tab
			v-if="visibleTab('explore')"
			:tab="tabs[1]"
			@click.native="closeMenu('explore')"
		/>
		<CreateTab
			v-if="visiblePosts.length > 1"
		/>
		<Tab
			v-else
			:tab="postTab"
			@click.native="closeMenu"
		/>
		<Tab
			:tab="tabs[2]"
			@click.native="closeMenu('notifications')"
		>
			<Badge :value="newRequests.length || newNotifications.length" />
		</Tab>
		<Tab
			:tab="tabs[3]"
			@click.native="closeMenu('profile')"
		/>
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
	GA_ACTIONS,
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
		community () {
			return this.$route.name === 'community';
		},
		tabs() {
			return [{
				uri: this.socket.isAuth ? '/all' : '/community',
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
			}];
		},
	},
	created () {
		this.$root.$on('notiPageLoad', data => this.onNoticationPage());
	},
	methods: {
		closeMenu (tab) {
			switch (tab) {
			case 'home':
				this.$showSignInDialog(false);
				this.$gaActionPrivate(GA_ACTIONS.CLICK_HOME);
				break;
			case 'explore':
				if (this.$isGuest() || !this.socket.isAuth) {
					this.$showSignInDialog();
				}
				this.$gaActionPrivate(GA_ACTIONS.CLICK_EXPLORE);
				break;
			case 'notifications':
				this.$showSignInDialog(false);
				this.$gaActionPrivate(GA_ACTIONS.NOTIFICATIONS);
				break;
			case 'profile':
				this.$showSignInDialog(false);
				break;
			}
			this.$root.$emit('overlayClose', { });
		},
		onNoticationPage () {
		},
		visibleTab(tabName) {
			return this.me.userRole === MERCHAND_ADMIN || (this.merchant.hideFeatures && !this.merchant.hideFeatures.includes(tabName));
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
			left unset
		>>> .tab_icon:before
			margin-bottom 0
</style>
