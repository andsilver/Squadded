<template>
	<div class="d-flex flex-grow-1 flex-column justify-space-between black py-12">
		<Brand />
		<div class="d-flex flex-column align-center signin">
			<strong class="white--text">{{ $t('shop_with_your_friends') }}</strong>
			<Button class="mt-3 signin-btn" @click.native="signin">
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
	margin-bottom: 10vh;

	&-btn {
		background-color: #FD6256 !important;
		color: white;
		width: 120px;
	}
}
</style>
