<template>
	<v-toolbar
		dense
		flat
		height="40"
		class="px-3 toolbar"
	>
		<v-tabs v-model="tab">
			<v-tab to="/all" @click.native="onTabClick(0)">
				{{ $t('topHome') }}
			</v-tab>
			<v-tab v-if="!mySquad" to="/feed" @click.native="onTabClick(1)">
				{{ $t('My Squad') }}
			</v-tab>
			<v-tab v-if="mySquad" to="/create-your-squad">
				{{ $t('My Squad') }}
			</v-tab>
		</v-tabs>
		<section class="buttons">
			<v-btn icon class="bag_btn">
				<v-icon>
					sqdi-shopping-bag
				</v-icon>
			</v-btn>
		</section>
	</v-toolbar>
</template>

<script>
import { sendGAction } from '~/utils/ga-action';
import { GA_ACTIONS } from '~/consts';

export default {
	props: {
		mySquad: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		tab: 0,
	}),
	methods: {
		onTabClick (tab) {
			sendGAction(tab === 0 ? GA_ACTIONS.CLICK_COMMUNITY : GA_ACTIONS.CLICK_SQUADDED);
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
		display none
		margin-left auto
		margin-right -16px
</style>
