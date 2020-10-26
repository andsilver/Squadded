<template>
	<section>
		<img v-if="avatar" :class="size" :src="avatar" alt="user avatar">
		<div v-else ref="user-avatar" class="dummy_image" :class="size" />
	</section>
</template>

<script>

export default {
	props: {
		avatar: {
			type: String,
			required: true,
		},
		size: {
			type: String,
			default: 'lg',
		},
	},
};
</script>

<style scoped>
	section{
		position: relative;
	}
	img {
		border-radius: 50%;
		border: 2px solid white;
		box-sizing: content-box;
	}
	.lg {
		width: 23.538vw;
		height: 23.538vw;
	}
	img.sm {
		width: 10vw;
		height: 10vw;
	}
</style>
<style lang="stylus" scoped>
.dummy_image
	background-image url('~assets/img/dummy_avater.svg')
	background-position center
	background-size 55%
	background-repeat no-repeat
	border-radius 50%
	border 0.92vw solid #fff
	background-color #F5F5F5

	&.sm
		width 12vw
		height 12vw
</style>
