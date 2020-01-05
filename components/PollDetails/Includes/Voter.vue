<template>
	<div class="d-flex align-center voter-section">
		<img :src="voter.avatar" alt="">
		<h5>
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
.voter-section
	padding 0 4.61vw
	margin-bottom 3.07vw
	img
		width 7.69vw
		height 7.69vw
		border-radius 50%
	h5
		font-size 3.07vw
		margin-left 3.13vw
</style>
