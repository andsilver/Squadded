<template>
	<div class="white--text brand">
		<h5 class="font-weight-medium">
			Welcome to
		</h5>
		<h3>
			{{ merchantTitle }}
		</h3>
	</div>
</template>
<script>
export default {
	props: {
		merchantTitle: {
			type: String,
			required: true,
		},
	},
};
</script>
<style lang="scss" scoped>
.brand {
	padding: 16vw 5vw 0;

	&-text {
		font-weight: 600;
		font-size: 4.615vw;
	}
}
</style>
