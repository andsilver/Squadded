<template>
	<v-layout
		column
		justify-center
		align-center
	>
		<div class="text-xs-center full-width">
			<div class="my-3">
				<span>Get started with</span>
			</div>
			<div class="my-3 social">
				<social-btn for="fb" />
				<span>or</span>
				<social-btn for="inst" />
			</div>
			<v-btn
				class="full-width"
				color="primary"
				depressed
			>
				Sign up
			</v-btn>
		</div>
	</v-layout>
</template>

<style lang="stylus">
.full-width {
	width 100%
	margin-left 0
	margin-right 0
}
.v-btn {
	font-weight normal
	text-transform unset
}
.social {
	display flex
	justify-content space-between

	span {
		line-height 50px
	}
}
</style>

<script>
import SocialBtn from '~/components/Social-Button.vue'

export default {
	components: {
		'social-btn': SocialBtn
	}
}
</script>
