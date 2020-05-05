<template>
	<v-toolbar
		dense
		flat
		height="40"
		class="px-3"
	>
		<v-tabs fixed-tabs>
			<v-tab color="#000" to="/create/outfit">
				{{ $t('create.outfit') }}
			</v-tab>
			<v-tab color="#000" to="/create/upload">
				{{ $t('create.upload') }}
			</v-tab>
			<v-tab color="#000" to="/create/poll">
				{{ $t('create.poll') }}
			</v-tab>
		</v-tabs>
	</v-toolbar>
</template>

<script>
export default {
};
</script>

<style lang="stylus" scoped>
.v-toolbar
	flex-grow 0
	.v-tab
		font-size: 3.733vw !important;
		font-weight: 600 !important;
		border-bottom: 1.2px solid #B8B8BA !important;
		min-width initial
		&--active
			border-bottom: 1.5px solid #202020;
		&:not(.v-tab--active)
			color #B8B8BA !important

</style>
