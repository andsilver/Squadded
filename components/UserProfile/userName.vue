<template>
	<h4 class="username">
		{{ `${name}` }}
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
	font-size 4.61vw
	font-weight 700
	color black
</style>
