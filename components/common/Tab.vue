<template>
	<v-tab
		:key="tab.uri"
		:to="tab.uri"
		:disabled="!socket.isAuth"
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
import { mapState } from 'vuex';

export default {
	props: {
		tab: {
			type: Object,
			required: true,
		},
	},
	computed: {
		...mapState([
			'socket',
		]),
	},
};
</script>

<style lang="stylus" scoped>
.tab_text
	position absolute
	font-size 2.76vw
	font-weight 600
	bottom 20%
	color #B8B8BA

.tab_icon
	position relative

.tab_icon .v-icon:before
	font-size .9em !important
	color #B8B8BA
	margin-bottom 55%

.v-tab--active .tab_icon:before,
.v-tab--active .tab_text
	color var(--brand-color)

.v-tab
	min-width auto
</style>
