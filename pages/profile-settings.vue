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
				<ProfileTab ref="profile" />
			</v-tab-item>
			<v-tab-item>
				<GeneralTab ref="general" />
			</v-tab-item>
		</v-tabs-items>
		<SaveConfirmDialog v-if="next" @save="save" @leave="leave" />
	</div>
</template>

<script>
import Topbar from '~/components/ProfileSettings/Topbar';
import ProfileTab from '~/components/ProfileSettings/ProfileTab';
import GeneralTab from '~/components/ProfileSettings/GeneralTab';
import SaveConfirmDialog from '~/components/ProfileSettings/SaveConfirmDialog';

export default {
	components: {
		Topbar,
		ProfileTab,
		GeneralTab,
		SaveConfirmDialog,
	},
	data: () => ({
		tabs: 0,
		next: null,
	}),
	methods: {
		save () {
			if (this.$refs.profile) {
				this.$refs.profile.saveProfile();
			}
			if (this.$refs.general) {
				this.$refs.general.save();
			}
			this.leave();
		},
		leave() {
			this.next && this.next();
		},
	},
	head: () => ({
		title: 'MyProfil-Settings',
	}),
	beforeRouteLeave (to, from, next) {
		const profileEditing = this.$refs.profile ? this.$refs.profile.editing : false;
		const generalEditing = this.$refs.general ? this.$refs.general.editing : false;
		if (!profileEditing && !generalEditing) {
			return next();
		}
		this.next = next;
	},
};
</script>
