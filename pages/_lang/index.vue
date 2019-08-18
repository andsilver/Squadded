<template>
	<v-layout
		column
		justify-center
		align-center
	>
		<div class="full-width">
			<nuxt-link
				to="/feed"
			>
				feed
			</nuxt-link>
			<div class="text-center my-2">
				<span>{{ $t('getStarted') }}</span>
			</div>
			<div class="my-3 social">
				<social-btn for="fb" />
				<span>{{ $t('or') }}</span>
				<social-btn for="inst" />
			</div>
			<sign-form />
		</div>
	</v-layout>
</template>

<style lang="stylus">
.full-width {
	width 100%
	margin-left 0
	margin-right 0
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
import SocialBtn from '~/components/Social-Button.vue';
import SignForm from '~/components/Sign-Form.vue';

export default {
	components: {
		'social-btn': SocialBtn,
		'sign-form': SignForm,
	},
};
</script>
