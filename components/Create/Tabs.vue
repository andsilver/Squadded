<template>
	<v-toolbar
		dense
		flat
		height="40"
		class="px-3"
	>
		<v-tabs fixed-tabs class="tabs_block">
			<v-tab to="/create/outfit">
				{{ $t('create.outfit') }}
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
