<template>
	<div class="text-center brand">
		<img src="~/assets/img/brand.PNG" alt="">
		<div class="text-uppercase white--text brand-text">
			{{ $t('shopping_party') }}
		</div>
	</div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.brand {
	background: black;
	padding: 10vw 0;

	img {
		width: 250px;
	}

	&-text {
		font-weight: 600;
		font-size: 4.615vw;
	}
}
</style>
