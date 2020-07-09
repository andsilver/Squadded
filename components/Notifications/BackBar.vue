<template>
	<h2>
		{{ title }}
	</h2>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '',
		},
	},
	methods: {
		goBack() {
			const { stack } = this.$router.history;
			const route = stack.reverse().find(s => !s.name.includes('notifications'));

			if (route) {
				return this.$router.push(route);
			}
			this.$router.back();
		},
	},
};
</script>

<style lang="stylus" scoped>
h2
	color #000
	font-size 4.307vw
	font-weight bold
	text-align center
	padding-bottom 0px
	position relative
	line-height 36px

	button
		position absolute
		left 0
</style>
