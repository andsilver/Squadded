<template>
	<button>
		<slot />
		<img v-if="img" :src="img">
		<span v-if="label">{{ label }}</span>
	</button>
</template>

<script>
export default {
	props: {
		img: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: '',
		},
	},
};
</script>

<style lang="stylus" scoped>
button
	display flex
	flex-direction column
	align-items center
	font-size 0.85em
	font-weight 600
	border 1.5px solid #ececec
	border-radius 10px

	margin 10pt auto 0
	width 70.76vw
	height 46.53vw

	img
		width 40pt
		margin auto 0 8pt
	span
		margin-bottom auto

</style>
