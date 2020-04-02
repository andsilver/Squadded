<template>
	<div class="d-flex flex-grow-1 flex-column justify-space-between black py-12">
		<Brand />
		<div class="loader-section">
			<img src="~/assets/img/loader-dark-transparent.gif" class="brand-loader">
		</div>
		<div class="d-flex flex-column align-center signin">
			<strong class="white--text">{{ $t('shop_with_your_friends') }}</strong>
			<Button class="mt-0 signin-btn" @click.native="signin">
				{{ $t('Signin') }}
			</Button>
		</div>
	</div>
</template>
<script>
import Brand from '~/components/common/Brand';
import Button from '~/components/common/Button';

export default {
	components: {
		Brand,
		Button,
	},
	methods: {
		signin () {
			this.$router.push('/');
		},
	},
};
</script>
<style lang="scss" scoped>
.signin {
	margin-bottom: 7vh;

	&-btn {
		background-color: #FD6256 !important;
		color: white;
		width: 120px;
	}
}
.loader-section{
	text-align: center;
}
img.brand-loader {
    width: 48.153vw;
}
strong.white--text {
    margin-bottom: 11vw;
    font-size: 4.92vw;
}
</style>
