<template>
	<v-app>
		<v-content>
			<logo />
			<v-container>
				<nuxt />
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
	components: {
		Logo
	},
	data() {
		return {
			title: 'Squad Widget'
		}
	}
}
</script>
