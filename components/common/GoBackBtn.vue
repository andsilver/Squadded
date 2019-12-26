<template>
	<v-btn ref="go-back-btn" icon :dark="dark" @click="goBack">
		<v-icon>
			sqdi-arrow-pointing-to-left
		</v-icon>
	</v-btn>
</template>

<script>
export default {
	props: {
		dark: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		goBack() {
			history.back();
		},
	},
};
</script>
