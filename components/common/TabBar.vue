<template>
	<v-tabs
		grow
		height="65"
		@click.native="(e) => onTabClick(e)"
	>
		<Tab :tab="tabs[0]" @click.native="closeMenu" />
		<Tab :tab="tabs[1]" @click.native="closeMenu" />
		<CreateTab />
		<Tab :tab="tabs[2]" @click.native="closeMenu">
			<Badge class="badge" :value="notify.length" />
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
		...mapGetters([
			NotificationGetters.notify,
		]),
		...mapState([
			'socket',
		]),
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
	},
};
</script>

<style lang="stylus" scoped>
.badge
	top 6px
	left 45px

@media screen and (max-width 300px)
	.v-tabs
		>>> .tab_text
			display none
		>>> .tab_icon:before
			margin-bottom 0
</style>
