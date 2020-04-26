<template>
	<div>
		<Topbar ref="top-bar" />
		<div class="px-4">
			<v-tabs v-model="tabs" fixed-tabs>
				<v-tab class="tabs py-2">
					<span ref="profile-tab" class="profile-tab-label">{{ $t('profile_settings.profile') }}</span>
				</v-tab>
				<v-tab class="tabs py-2">
					<span ref="general-tab" class="profile-tab-label">{{ $t('profile_settings.general') }}</span>
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
		<div class="mt-4 py-4 d-flex justify-center">
			<Button ref="save-button" style="width: 36.92vw;height: 12.30vw; letter-spacing: 1px;" @click.native="saveProfile">
				{{ $t('Save') }}
			</Button>
		</div>
		<SaveConfirmDialog v-if="next" @save="save" @leave="leave" @close="next = null" />
	</div>
</template>

<script>
import Topbar from '~/components/ProfileSettings/Topbar';
import ProfileTab from '~/components/ProfileSettings/ProfileTab';
import GeneralTab from '~/components/ProfileSettings/GeneralTab';
import SaveConfirmDialog from '~/components/ProfileSettings/SaveConfirmDialog';
import Button from '~/components/common/Button';
import { UserStore, UserActions } from '~/store/user';

export default {
	components: {
		Topbar,
		ProfileTab,
		GeneralTab,
		SaveConfirmDialog,
		Button,
	},
	data: () => ({
		tabs: 0,
		next: null,
	}),
	methods: {
		save() {
			this.saveProfile();
			this.leave();
		},
		leave() {
			this.next && this.next();
		},
		saveProfile() {
			const { profile, general } = this.$refs;

			if (profile && (!profile.user.screenName || !profile.user.avatar)) {
				return;
			}

			profile.editing = false;
			const user = profile.user;

			if (general) {
				general.editing = false;
				user.language = general.user.language;
				this.$root.$i18n.fallbackLocale = user.language;
			}

			this.$store.dispatch(`${UserStore}/${UserActions.setProfile}`, user);
			this.$router.push('/me');
		},
	},
	head: () => ({
		title: 'MyProfil-Settings',
	}),
	beforeRouteLeave(to, from, next) {
		const profileEditing = this.$refs.profile ? this.$refs.profile.editing : false;
		const generalEditing = this.$refs.general ? this.$refs.general.editing : false;
		if (!profileEditing && !generalEditing) {
			return next();
		}
		this.next = next;
	},
};
</script>
<style lang="stylus">
.profile-tab-label
	font-size 4.30vw
</style>
