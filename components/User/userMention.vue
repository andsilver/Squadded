<template>
	<p>{{ mention }}</p>
</template>

<script>
export default {
	props: {
		mention: {
			type: String,
			default: '',
		},
	},
};
</script>

<style scoped>
	p {
		font-weight: 700;
		margin-bottom: 1%;
		color: #B8B8BA;
	}
</style>
