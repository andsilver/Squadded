<template>
	<v-tab
		:key="tab.uri"
		:to="tab.uri"
		exact
		class="tab_item"
	>
		<span class="tab_icon">
			<v-icon>
				{{ tab.icon }}
			</v-icon>
			<slot />
		</span>
		<span class="tab_text">{{ $t(tab.text) }}</span>
	</v-tab>
</template>

<script>
export default {
	props: {
		tab: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-tab
	min-width auto

.tab_text
	position absolute
	font-size 2.76vw
	font-weight 600
	bottom 15%
	left 0
	color #B8B8BA
	width 100%
	text-align center

.tab_icon
	position relative
	.v-icon:before
		font-size .9em !important
		color #B8B8BA
		margin-bottom 55%

.v-tab--active
	.tab_icon .v-icon:before,
	.tab_text
		color var(--brand-color)

</style>
