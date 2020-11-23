<template>
	<v-toolbar
		dense
		flat
		height="40"
		class="px-3 toolbar"
	>
		<v-tabs :value="tab">
			<v-tab class="tab-active v-tab--active" @click="() => openSignInDialog(false)">
				{{ $t('topHome') }}
			</v-tab>
			<v-tab class="tab-inactive" @click="() => openSignInDialog(true)">
				{{ $t('My Squad') }}
			</v-tab>
		</v-tabs>
	</v-toolbar>
</template>

<script>
import { ROOT_EVENTS } from '~/consts';

export default {
	data: () => ({
		tab: 0,
	}),
	methods: {
		signin () {
			this.$router.push('/');
		},
		openSignInDialog(mysquad = false) {
			if (!this.$store.state.merchant.guest || mysquad) {
				this.$root.$emit(ROOT_EVENTS.SHOW_SIGNIN_DIALOG, true);
			}
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
	.v-tab--active
		color var(--brand-color) !important

	>>> .v-tabs-slider
		color transparent !important

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

	.tab-active
		border-bottom 2px solid

	.tab-inactive
		color #b8b8ba !important
</style>
