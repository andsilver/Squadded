<template>
	<div class="suspense">
		<v-progress-circular
			color="primary"
			size="150"
			indeterminate
			class="progress"
		/>
	</div>
</template>

<script>
export default {
};
</script>

<style lang="stylus">
.suspense
	display flex
	flex-grow 1

	.progress
		margin auto
</style>
