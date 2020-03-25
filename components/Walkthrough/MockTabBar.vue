<template>
	<v-tabs
		grow
		height="65"
	>
		<Tab :tab="tabs[0]" :class="{ 'v-tab--active': fakeActiveTab }" />
		<Tab :tab="tabs[1]" />
		<CreateTab />
		<Tab :tab="tabs[2]">
			<Badge class="badge" :value="10" />
		</Tab>
		<Tab :tab="tabs[3]" />
	</v-tabs>
</template>

<script>
import CreateTab from '~/components/common/CreateTab';
import Tab from '~/components/common/Tab';
import Badge from '~/components/common/Badge';

export default {
	components: {
		Badge,
		CreateTab,
		Tab,
	},
	data: () => ({
		fakeActiveTab: true,
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
};
</script>

<style lang="stylus" scoped>
.badge
	top 12px
	left 39px

@media screen and (max-width 300px)
	.v-tabs
		>>> .tab_text
			display none
		>>> .tab_icon:before
			margin-bottom 0
</style>
