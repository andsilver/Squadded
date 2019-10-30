<template>
	<section>
		<img :src="user.avatar" alt="user avatar">
	</section>
</template>

<script>

export default {
	props: {
		user: {
			type: Object,
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
		width: 28%;
		border-radius: 50%;
		border: 3px solid white;

		box-sizing: content-box;
	}
</style>
