<template>
	<v-tabs
		grow
		height="65"
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
import { createNamespacedHelpers } from 'vuex';
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
			uri: '/feed',
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
	},
	methods: {
		closeMenu () {
			this.$root.$emit('overlayClose', { });
		},
	},
};
</script>

<style lang="stylus" scoped>
.badge
	top 6px
	left 45px
</style>
