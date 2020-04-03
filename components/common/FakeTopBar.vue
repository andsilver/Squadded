<template>
	<v-toolbar
		dense
		flat
		height="55"
		class="px-3 toolbar"
	>
		<v-tabs v-model="tab">
			<v-tab class="v-tab--active" to="/">
				{{ $t('Home') }}
			</v-tab>
			<v-tab to="/">
				{{ $t('My Squad') }}
			</v-tab>
		</v-tabs>
		<section class="buttons">
			<Button class="sign_btn" @click="signin">
				{{ $t('Signin') }}
			</Button>
		</section>
	</v-toolbar>
</template>

<script>
export default {
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
		margin-left -12px

	.v-tab
		min-width auto
		padding 0
		margin-right 5%

		font-size 3.23vw
		font-weight 700
		text-align left !important
		color #B8B8BA !important
		border-bottom: 2px solid #ffffff

	.v-tab--active
		color black !important
		position relative
	.v-tab--active::after
		position absolute
		width 100%
		content ''
		border 0.45vw solid #000
		bottom 10px
	.buttons
		display flex
		margin-left auto
		margin-right -16px
	button.sign_btn
		width 28.92vw
		margin-right 0
		border 2px solid #000
		border-radius 10px
		height 12.30vw
		font-weight 600
		font-size 2.76vw
		margin-top 3.3vw
		text-transform uppercase
		letter-spacing 1px
</style>
