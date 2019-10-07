<template>
	<v-tabs centered>
		<v-tab v-for="tab in tabs" :key="tab.uri">
			<nuxt-link :to="tab.uri">
				<v-icon>
					{{ tab.icon }}
				</v-icon>
			</nuxt-link>
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
