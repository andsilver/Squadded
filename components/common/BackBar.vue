<template>
	<h2>
		<GoBackBtn />
		{{ title }}
	</h2>
</template>

<script>
import GoBackBtn from '~/components/common/GoBackBtn';

export default {
	components: {
		GoBackBtn,
	},
	props: {
		title: {
			type: String,
			default: '',
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
