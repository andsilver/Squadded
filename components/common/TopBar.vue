<template>
	<v-toolbar dense flat>
		<v-tabs>
			<v-tab to="/feed">
				{{ $t('My Squad') }}
			</v-tab>
			<v-tab to="/community">
				{{ $t('Community') }}
			</v-tab>
		</v-tabs>
		<div class="flex-grow-1" />
		<v-btn icon>
			<v-icon>
				sqdi-add-user
			</v-icon>
		</v-btn>
		<v-btn icon>
			<v-icon>
				sqdi-shopping-bag
			</v-icon>
		</v-btn>
	</v-toolbar>
</template>

<script>
export default {
};
</script>
