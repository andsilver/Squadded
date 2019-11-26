<template>
	<v-btn
		depressed
		rounded
		:dark="dark"
		:color="dark ? '#000' : '' "
		:disabled="disabled"
	>
		<slot />
	</v-btn>
</template>

<script>
export default {
	props: {
		active: {
			type: Boolean,
			default: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		dark () {
			return this.active && !this.disabled;
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-btn
	min-height 36px
	min-width 64px
	padding 0 16px
	margin-left auto
	margin-right auto

	text-transform uppercase
	font-size .6em
	font-weight 700
	letter-spacing 1px
	outline none
	&:disabled
		background-color #bbbbbb
	&--rounded
		border-radius 10px
</style>
