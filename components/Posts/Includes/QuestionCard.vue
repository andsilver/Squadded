<template>
	<v-card ref="card" class="question-card pa-3 d-flex align-center justify-center" :elevation="1" :style="{ background }">
		<slot />
	</v-card>
</template>

<script>
export default {
	props: {
		background: {
			type: String,
			required: true,
		},
	},
	mounted () {
		this.$emit('mounted');
	},
};
</script>

<style lang="scss" scoped>
.question-card {
	color: white;
	border-radius: 10px;
	min-height: 172px;
}
</style>
