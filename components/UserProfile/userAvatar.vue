<template>
	<section>
		<img v-if="avatar" :src="avatar" alt="user avatar">
		<div v-else ref="user-avatar" class="dummy_image" />
	</section>
</template>

<script>

export default {
	props: {
		avatar: {
			type: String,
			required: true,
		},
	},
};
</script>

<style scoped>
	section{
		position: relative;
	}
	img {
		width: 23.538vw;
		height: 23.538vw;
		border-radius: 50%;
		border: 2px solid white;
		box-sizing: content-box;
	}
</style>
<style lang="stylus" scoped>
.dummy_image
	background-image url('~assets/img/dummy_avater.svg')
	background-position center
	background-size 55%
	background-repeat no-repeat
	width: 23.538vw;
	height: 23.538vw;
	border-radius 50%
	border 0.92vw solid #fff
	background-color #F5F5F5
</style>
