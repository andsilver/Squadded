<template>
	<v-btn icon @click="goBack">
		<v-icon>
			sqdi-arrow-pointing-to-left
		</v-icon>
	</v-btn>
</template>

<script>
export default {
	methods: {
		goBack() {
			history.back();
		},
	},
};
</script>
