<template>
	<h2>
		<v-btn ref="step-back-btn" icon @click="$emit('back')">
			<v-icon>
				sqdi-arrow-pointing-to-left
			</v-icon>
		</v-btn>
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
	width 100%
	button
		position absolute
		left 0
</style>
