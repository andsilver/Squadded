<template>
	<v-toolbar
		dense
		flat
		height="40"
		class="px-3 toolbar"
	>
		<v-tabs class="tabs_block">
			<v-tab to="/feed">
				{{ $t('My Squad') }}
			</v-tab>
			<v-tab to="/squadders">
				{{ $t('Community') }}
			</v-tab>
		</v-tabs>
		<section class="buttons">
			<v-btn icon class>
				<v-icon>
					sqdi-add-user
				</v-icon>
			</v-btn>
			<v-btn icon class="bag_btn">
				<v-icon>
					sqdi-shopping-bag
				</v-icon>
				<span class="shopping_bag_count">4</span>
			</v-btn>
		</section>
	</v-toolbar>
</template>

<script>
export default {
};
</script>
<style lang="stylus" scoped>
	.toolbar
		margin-top 3.4%
		z-index 10

	.v-tab
		min-width auto
		padding 0
		margin-right 5%

		font-size .75em
		font-weight 700
		text-align left !important
		color #B8B8BA !important

	.v-tab--active
		color black !important

	.v-btn
		color black !important
		width 40px !important
		height 40px !important

	.v-btn i
		background-color transparent
		font-size 1.5em !important

	.shopping_bag_count
		position absolute

		bottom -6px
		right 6px

		width 14px
		height 14px
		font-size 9px
		line-height 14px

		color #fff
		background-color #FD6256
		border-radius 50%
		font-weight 900

	.buttons
		display flex
		width 20%
		margin-left auto
</style>
