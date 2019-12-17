<template>
	<v-toolbar
		dense
		flat
		height="40"
		class="px-3"
	>
		<v-tabs fixed-tabs>
			<v-tab color="#B8B8BA" to="/notifications">
				{{ $t('All') }}
			</v-tab>
			<v-tab color="#B8B8BA" to="/notifications/requests">
				{{ $t('Requests') }}
			</v-tab>
			<v-tab color="#B8B8BA" to="/notifications/pushed">
				{{ $t('Pushed') }}
			</v-tab>
		</v-tabs>
	</v-toolbar>
</template>

<script>
export default {
};
</script>

<style lang="stylus" scoped>
.v-tab
	font-size: 3.733vw !important;
	font-weight: 600 !important;
	border-bottom: 1.2px solid #B8B8BA !important;
	&--active
		border-bottom: 1.5px solid #202020;
</style>
