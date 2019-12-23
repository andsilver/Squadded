<template>
	<div class="d-flex align-center mb-3">
		<img :src="voter.avatar" alt="">
		<h5 class="ml-2">
			{{ voter.screenName }}
		</h5>
	</div>
</template>

<script>
export default {
	props: {
		voter: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
img
	width 30px
	height 30px
	border-radius 50%
</style>
