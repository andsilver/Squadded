<template>
	<v-tabs
		grow
		height="65"
	>
		<v-tab
			v-for="tab in tabs"
			:key="tab.uri"
			:to="tab.uri"
			class="tab_item"
			:class="tab.tabSpecialClass ? tab.tabSpecialClass : '' "
		>
			<v-icon class="tab_icon" :class="tab.specialClass ? tab.specialClass : '' ">
				{{ tab.icon }}
			</v-icon>
			<span class="tab_text">{{ $t(tab.text) }}</span>
		</v-tab>
	</v-tabs>
</template>

<script>
export default {
	data: () => ({
		tabs: [{
			uri: '/feed',
			icon: 'sqdi-blank-house',
			text: 'Home',
		}, {
			uri: '/explore',
			icon: 'sqdi-magnifying-glass-finder',
			text: 'Explore',
		}, {
			uri: '/poll/new',
			icon: 'sqdi-plus',
			text: '',
			specialClass: 'plus_icon',
			tabSpecialClass: 'plus_button',
		}, {
			uri: '/notification',
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

<style scoped>
	.tab_text {
		position: absolute;
		font-size: .7em;
		font-weight: 600;
		bottom: 20%;
		color: #B8B8BA;
	}

	.tab_icon:before {
		font-size: .9em !important;
		color: #B8B8BA;
		margin-bottom: 55%;
	}

	.v-tab--active .tab_icon:before,
	.v-tab--active .tab_text {
		color: black;
	}

	.v-tab {
		min-width: auto;
	}
	.plus_icon:before {
		color: black;
		font-size: .6em !important;
		margin-bottom: 0;
	}

	.plus_button:after {
		display: block;
		position: absolute;
		content: "";
		z-index: 5;
		border: 2px solid black;
		border-radius: 10px;
		height: 45px;
		width: 45px;
	}
</style>
