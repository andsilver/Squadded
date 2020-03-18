<template>
	<v-toolbar
		dense
		flat
		height="40"
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
				{{ $t('Sign in') }}
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

	.v-tab
		min-width auto
		padding 0
		margin-right 5%

		font-size .75em
		font-weight 700
		text-align left !important
		color #B8B8BA !important
		border-bottom: 2px solid #ffffff

	.v-tab--active
		color black !important
		border-bottom 2px solid #000

	.buttons
		display flex
		margin-left auto
		margin-right -16px
	button.sign_btn
		width 80px
		margin-right 10px
		border 2px solid #000
		border-radius 10px
		height 10vw
		font-weight 600
		font-size 0.75em
		margin-top 4px;
</style>
