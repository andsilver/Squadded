<template>
	<div class="d-flex align-center justify-center error-page">
		<div class="flex-grow-1 d-flex flex-column justify-center">
			<div ref="images" class="error-images d-flex justify-center">
				<img class="oops-image" src="~/assets/img/error-oops.svg">
				<img class="qob-image" src="~/assets/img/question-outline-bubble.svg">
			</div>
			<div ref="error-text" class="text-center mt-8 error-text">
				{{ $t('error.oops') }}
			</div>
			<Button ref="go-to-feed-button" class="mt-8 px-10" @click.native="goToFeed">
				<strong>{{ $t('error.go_to_feed') }}</strong>
			</Button>
		</div>
	</div>
</template>

<script>
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	methods: {
		goToFeed() {
			this.$router.push('/feed');
		},
	},
};
</script>

<style lang="stylus" scoped>
.error-page
	height 100%
	padding 100px 24px

.error-text
	font-size 14px

.error-images
	position relative
	.oops-image
		width: 72px
	.qob-image
		width 40px
		position absolute
		right calc(50% - 92px)
</style>
