<template>
	<section>
		<img :src="user.avatar" :class=" user.scrolled === true ? 'fixed_profile' : 'basic_img' " alt="user avatar">
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
	img {
		border-radius: 50%;
	}

	.fixed_profile {
		width: 15%;
	}

	.basic_img {
		width: 30%;
	}
</style>
