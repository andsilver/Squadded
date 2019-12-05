<template>
	<v-toolbar
		dense
		flat
		height="40"
		class="px-3 custom-outfit-select"
	>
		<v-tabs fixed-tabs class="tabs_block">
			<v-tab to="/create/outfit">
				{{ $t('create.outfit') }}
			</v-tab>
			<v-tab to="">
				{{ $t('create.photo') }}
			</v-tab>
			<v-tab to="/create/poll">
				{{ $t('create.poll') }}
			</v-tab>
		</v-tabs>
	</v-toolbar>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
.custom-outfit-select .v-tab {
    font-size: 3.733v !important;
    color: #000 !important;
    font-weight: 600 !important;
}
.custom-outfit-select .v-tab:not(.v-tab--active){
    color: #B8B8BA !important;
}
.custom-outfit-select  .v-tab {
    border-bottom: 1.2px solid #B8B8BA !important;
}
.custom-outfit-select .v-tab--active {
    border-bottom: 1.5px solid #202020;
}
</style>
