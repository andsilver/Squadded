<template>
	<div>
		<Topbar ref="top-bar" />
		<div class="px-3">
			<v-tabs v-model="tabs" fixed-tabs center-active>
				<v-tab class="tabs pt-3">
					<span ref="profile-tab">{{ $t('profile_settings.profile') }}</span>
				</v-tab>
				<v-tab class="tabs pt-3">
					<span ref="general-tab">{{ $t('profile_settings.general') }}</span>
				</v-tab>
			</v-tabs>
		</div>
		<v-tabs-items v-model="tabs">
			<v-tab-item>
				<ProfileTab />
			</v-tab-item>
			<v-tab-item>
				<GeneralTab />
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import Topbar from '~/components/ProfileSettings/Topbar';
import ProfileTab from '~/components/ProfileSettings/ProfileTab';
import GeneralTab from '~/components/ProfileSettings/GeneralTab';

export default {
	components: {
		Topbar,
		ProfileTab,
		GeneralTab,
	},
	data: () => ({
		tabs: 0,
	}),
	head: () => ({
		title: 'MyProfil-Settings',
	}),
};
</script>
