<template>
	<v-app>
		<v-content>
			<logo />
			<v-container>
				<nuxt />
			</v-container>
		</v-content>
		<v-footer
			app
		>
			<span>&copy; 2019</span>
		</v-footer>
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
