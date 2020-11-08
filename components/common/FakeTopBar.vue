<template>
	<v-toolbar
		dense
		flat
		height="40"
		class="px-3 toolbar"
	>
		<v-tabs v-model="tab">
			<v-tab class="v-tab--active" @click="$emit('open-signin-dialog')">
				{{ $t('Home') }}
			</v-tab>
			<v-tab @click="$emit('open-signin-dialog')">
				{{ $t('My Squad') }}
			</v-tab>
		</v-tabs>
		<section class="buttons">
			<Button class="sign_btn" @click="signin">
				{{ $t('Signin') }} >
			</Button>
		</section>
	</v-toolbar>
</template>

<script>
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	data: () => ({
		tab: 1,
	}),
	methods: {
		signin () {
			this.$router.push('/');
		},
	},
};
</script>

<style lang="stylus" scoped>
	.toolbar
		position fixed
		top 0
		width 100%
		z-index 10

	.v-tab
		min-width auto
		padding 0
		margin-right 5%
		font-size .75em
		font-weight 700
		text-align left !important
		color #B8B8BA !important
		@media screen and (max-width: 280px)
			font-size 4vw
	.v-tab--active,
	>>> .v-tabs-slider
		color var(--brand-color) !important

	.buttons
		display flex
		margin-left auto
		margin-right -16px
	button.sign_btn
		font-size: 8px;
		width: 60px;
		height: 32px !important;
		min-height: 32px;
		border-radius: 10px;
</style>
