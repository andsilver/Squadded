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
		width: 28.30vw;
		border-radius: 50%;
		border: 0.61vw solid white;
		box-sizing: content-box;
	}
</style>
