<template>
	<h4>{{ `@${name}` }}</h4>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			default: '',
		},
	},
};
</script>

<style scoped>
</style>
