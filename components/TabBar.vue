<template>
	<v-tabs centered>
		<v-tab
			v-for="tab in tabs"
			:key="tab.uri"
			:to="tab.uri"
		>
			<v-icon>
				{{ tab.icon }}
			</v-icon>
		</v-tab>
	</v-tabs>
</template>

<script>
export default {
	data: () => ({
		tabs: [{
			uri: '/feed',
			icon: 'mdi-home',
		}, {
			uri: '/me',
			icon: 'mdi-account',
		}],
	}),
};
</script>
