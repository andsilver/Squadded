<template>
	<h4 class="username">
		{{ `@${name}` }}
	</h4>
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

<style lang="stylus" scoped>
.username
	font-size 3.69vw
	margin-top 1.79vw
	font-weight 600
	color #B8B8BA
</style>
