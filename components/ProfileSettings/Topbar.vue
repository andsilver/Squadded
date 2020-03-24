<template>
	<div class="pa-3 d-flex justify-space-between align-center">
		<GoBackBtn ref="go-back-btn" />
		<h3 ref="profile-settings-title">
			{{ $t('profile_settings.title') }}
		</h3>
		<v-btn icon class="hide-button" />
	</div>
</template>

<script>
import GoBackBtn from '~/components/common/GoBackBtn';

export default {
	components: {
		GoBackBtn,
	},
};
</script>

<style lang="stylus" scoped>
.hide-button
	pointer-events none
</style>
