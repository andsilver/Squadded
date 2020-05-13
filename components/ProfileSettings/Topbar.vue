<template>
	<div class="pa-3 d-flex justify-space-between align-center">
		<v-btn ref="go-back-btn" icon @click="goBack">
			<v-icon>
				sqdi-arrow-pointing-to-left
			</v-icon>
		</v-btn>
		<h3 ref="profile-settings-title" class="profile-settings-title">
			{{ $t('profile_settings.title') }}
		</h3>
		<v-btn icon class="hide-button" />
	</div>
</template>

<script>
export default {
	methods: {
		goBack() {
			this.$router.push('/me');
		},
	},
};
</script>

<style lang="stylus" scoped>
.hide-button
	pointer-events none
.profile-settings-title
	font-size 4.30vw
</style>
