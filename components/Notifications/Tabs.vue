<template>
	<v-toolbar
		dense
		flat
		height="48"
		class="px-3"
	>
		<v-tabs v-model="tabs" fixed-tabs class="mt-2">
			<v-tab color="#B8B8BA" to="/notifications">
				{{ $t('All') }}
			</v-tab>
			<v-tab color="#B8B8BA" to="/notifications/requests">
				{{ $t('Requests') }}
				<span v-if="newRequests && newRequests.length" class="red-dot" />
			</v-tab>
		</v-tabs>
	</v-toolbar>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { NotificationStore } from '~/store/notification';
const notifGetters = createNamespacedHelpers(NotificationStore).mapGetters;

export default {
	data: () => ({
		tabs: 0,
	}),
	computed: {
		...notifGetters(['newRequests']),
	},
	mounted () {
		this.tabs = this.$route.path.includes('/requests') ? 1 : 0;
	},
};
</script>

<style lang="stylus" scoped>
.v-tab
	font-size: 3.733vw !important;
	font-weight: 600 !important;
	border-bottom: 1.2px solid #B8B8BA !important;
	position relative
	&--active
		border-bottom: 1.5px solid #202020;

	.red-dot
		position absolute
		right 10px
		border-radius 50%
		padding 2px
		background #fd6256
</style>
