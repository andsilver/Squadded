<template>
	<div class="pa-3 d-flex justify-space-between align-center">
		<GoBackBtn ref="go-back-btn" />
		<h3 ref="profile-settings-title">
			{{ $t('profile_settings.title') }}
		</h3>
		<v-btn icon>
			<v-icon>mdi-power</v-icon>
		</v-btn>
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
