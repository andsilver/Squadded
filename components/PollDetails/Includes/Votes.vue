<template>
	<div class="votes-count">
		<h3>{{ votes }} {{ $tc('poll.votes', votes) }}</h3>
	</div>
</template>

<script>
export default {
	props: {
		votes: {
			type: Number,
			default: 0,
		},
	},
};
</script>

<style lang="stylus" scoped>
.votes-count
	margin-bottom 4.4VW
	padding 0 4.61vw
	h3
		font-size 4.30vw
</style>
