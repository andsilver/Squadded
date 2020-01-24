<template>
	<div v-if="user" class="py-4 profile-content">
		<div class="px-3">
			<section class="fixed_profile">
				<v-avatar ref="user-avatar" class="user_avatar" width="100px" height="100px" min-width="none">
					<v-img :key="user.avatar" :src="user.avatar" />
				</v-avatar>
			</section>
			<section class="profile_background_image">
				<section class="background_shadow" />
				<v-img height="162" src="https://picsum.photos/id/699/600/300" />
			</section>
			<v-btn class="btn-update-cover">
				<v-icon>
					mdi-settings
				</v-icon>
				<span class="ml-1">{{ $t('profile_settings.update_cover') }}</span>
			</v-btn>
		</div>
		<div class="form-area px-3">
			<section>
				<label class="input-label" for="name">{{ $t('form.name') }}</label>
				<v-text-field
					id="name"
					ref="name-field"
					v-model="user.name"
					hide-details
					outlined
					dense
				/>
			</section>
			<section class="mt-4">
				<label class="input-label" for="bio">{{ $t('form.bio') }}</label>
				<v-text-field
					id="bio"
					ref="bio-field"
					v-model="user.bio"
					hide-details
					outlined
					dense
				/>
			</section>
			<section class="mt-4">
				<label class="input-label" for="instagram_username">{{ $t('form.instagram_username') }}</label>
				<v-text-field
					id="instagram_username"
					ref="instagram-username-field"
					v-model="user.username"
					hide-details
					outlined
					dense
				/>
			</section>
			<section class="mt-4 d-flex">
				<div class="mr-2">
					<v-btn icon>
						<v-icon small color="black">
							{{ user.private ? 'mdi-lock-outline': 'mdi-lock-open-outline' }}
						</v-icon>
					</v-btn>
				</div>
				<div class="mt-1 flex-grow-1">
					<div class="d-flex justify-space-between align-center">
						<h5>{{ user.private ? $t('profile_settings.private_profile.title') : $t('profile_settings.public_profile.title') }}</h5>
						<v-btn
							ref="toggle-private"
							rounded
							depressed
							small
							style="text-transform: lowercase;"
							@click="togglePublic"
						>
							{{ $t('publicToggle.toggle') }}
						</v-btn>
					</div>
					<div
						v-if="user.private"
						ref="private-description"
						class="mt-2 input-label"
					>
						{{ $t('profile_settings.private_profile.description') }}
					</div>
				</div>
			</section>
		</div>
		<section class="delete-account pa-3 d-flex mt-4">
			<v-btn icon style="background: #fea7a0;">
				<v-icon x-small color="black">
					sqdi-close-cross
				</v-icon>
			</v-btn>
			<div class="ml-2 d-flex flex-grow-1 justify-space-between align-center">
				<h5>
					{{ $t('profile_settings.delete_account') }}
				</h5>
				<v-btn
					ref="delete-button"
					style="background: #fea7a0; text-transform: lowercase;"
					rounded
					depressed
					small
				>
					{{ $t('Delete') }}
				</v-btn>
			</div>
		</section>
		<div class="mt-4 py-4 d-flex justify-center">
			<Button ref="save-button" style="width: 100px;" @click.native="saveProfile">
				{{ $t('Save') }}
			</Button>
		</div>
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import Button from '~/components/common/Button';
import { UserStore, UserActions } from '~/store/user';

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	components: {
		Button,
	},
	data: () => ({
		user: null,
	}),
	computed: {
		...mapState(['me']),
	},
	watch: {
		me() {
			this.user = Object.assign({}, this.me);
		},
	},
	mounted() {
		this.user = Object.assign({}, this.me);
	},
	methods: {
		togglePublic() {
			this.user.private = !this.user.private;
			this.user = Object.assign({}, this.user);
		},
		async saveProfile() {
			await this.$store.dispatch(
				`${UserStore}/${UserActions.setProfile}`,
				this.user,
			);
			if (history.length) {
				history.back();
				return;
			}
			this.$router.push('/me');
		},
	},
};
</script>
<style lang="stylus" scoped>
.profile-content {
	position: relative;
}

.profile_background_image {
	width: 100%;
	left: 0;
	z-index: 0;
}

.background_shadow {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
}

.fixed_profile {
	position: absolute;
	top: 132px;
	left: calc(50% - 50px);
	z-index: 99;
	border: 3px solid white;
	border-radius: 50%;
	background: white;
}

.btn-update-cover {
	font-size: 10px;
	border-radius: 8px;
	opacity: 0.8;
	padding: 0px 8px !important;
	position: absolute;
	top: 30px;
	left: 16px;
	background: white;
}

.form-area {
	margin-top: 80px;
}

.input-label {
	color: #9e9e9e;
	font-weight: 500;
	font-size: 14px;
}

.delete-account {
	background: #ffedeb;
}

section .v-btn
	background-color rgba(218, 217, 221, 0.3)
	color black
	font-weight 600
</style>
