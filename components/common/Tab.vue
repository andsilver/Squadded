<template>
	<v-tab
		:key="tab.uri"
		:to="tab.uri"
		class="tab_item"
	>
		<v-icon class="tab_icon">
			{{ tab.icon }}
		</v-icon>
		<span class="tab_text">{{ $t(tab.text) }}</span>
		<slot />
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
.tab_text
	position absolute
	font-size .8em
	font-weight 600
	bottom 20%
	color #B8B8BA

.tab_icon:before
	font-size .9em !important
	color #B8B8BA
	margin-bottom 55%

.v-tab--active .tab_icon:before,
.v-tab--active .tab_text
	color black

.v-tab
	min-width auto
</style>
