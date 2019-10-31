<template>
	<button><slot /></button>
</template>

<script>
export default {
};
</script>

<style lang="stylus" scoped>
button
	padding 4.5% 14%
	margin-top 5%
	margin-left auto
	margin-right auto

	background-color black
	border-radius 10px

	color white
	text-transform uppercase
	font-size .6em
	font-weight 700
	letter-spacing 1px
	outline none
</style>
