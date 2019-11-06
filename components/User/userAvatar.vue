<template>
	<section>
		<img :src="avatar" alt="user avatar">
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
		width: 28%;
		border-radius: 50%;
		border: 3px solid white;

		box-sizing: content-box;
	}
</style>
