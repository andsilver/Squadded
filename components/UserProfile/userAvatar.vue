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
		width: 23.538vw;
		height: 23.538vw;
		border-radius: 50%;
		border: 2px solid white;
		box-sizing: content-box;
	}
</style>
