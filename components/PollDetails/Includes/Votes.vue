<template>
	<div class="mb-4">
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

<style lang="stylus" scoped></style>
