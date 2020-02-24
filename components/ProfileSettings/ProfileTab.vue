<template>
	<div v-if="user" class="py-4 profile-content">
		<div class="px-3">
			<section class="fixed_profile">
				<v-avatar ref="user-avatar" class="user_avatar" width="100px" height="100px" min-width="none">
					<v-img :key="user.avatar" :src="user.avatar" />
				</v-avatar>
				<client-only>
					<ImageUploader
						v-show="false"
						id="avatar-input"
						ref="avatar-input"
						:max-width="200"
						:debug="1"
						:quality="0.9"
						accept="image/*"
						output-format="verbose"
						@input="setImage"
						@onComplete="completeCompress"
					/>
				</client-only>
				<v-btn ref="avatar-upload-btn" class="edit-icon-sec" icon @click="openFileUpload">
					<img src="../../assets/img/action-edit.svg" class="edit-icon-image" width="14px" height="14px">
				</v-btn>
			</section>
			<section class="profile_background_image">
				<section class="background_shadow" />
				<v-img height="162" src="https://picsum.photos/id/699/600/300" />
			</section>
			<v-btn class="btn-update-cover" hidden>
				<v-icon>
					mdi-settings
				</v-icon>
				<span class="ml-1">{{ $t('profile_settings.update_cover') }}</span>
			</v-btn>
		</div>
		<div class="form-area px-3">
			<section>
				<label class="input-label" for="name">{{ $t('form.instagram_username') }}</label>
				<v-text-field
					id="instagram_username"
					ref="instagram-username-field"
					v-model="user.screenName"
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
				<label class="input-label" for="instagram_username">{{ $t('form.name') }}</label>
				<v-text-field
					id="name"
					ref="name-field"
					v-model="user.name"
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
						<h5>
							{{ $t('profile_settings.profile_privacy') }}
						</h5>
						<div class="select-control">
							<v-select
								id="private-select"
								ref="toggle-private"
								v-model="user.private"
								:items="profileTypes"
								item-value="value"
								item-text="name"
								solo
								flat
								rounded
								hide-details
							/>
						</div>
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
		<!--section class="delete-account pa-3 d-flex mt-4">
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
		</section-->
		<div class="mt-4 py-4 d-flex justify-center">
			<Button ref="save-button" style="width: 100px;" @click.native="saveProfile">
				{{ $t('Save') }}
			</Button>
		</div>
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import ImageUploader from 'vue-image-upload-resize';
import { dataURItoBlob } from '~/utils/dataUriToBlob';
import { PostStore, PostMutations } from '~/store/post';
import { prefetch } from '~/helpers';
import Button from '~/components/common/Button';
import { UserStore, UserActions } from '~/store/user';

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	components: {
		Button,
		ImageUploader,
	},
	data: () => ({
		user: null,
		profileTypes: [
			{ value: false, name: 'Public' },
			{ value: true, name: 'Private' },
		],
		input: null,
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
		openFileUpload() {
			const el = document.getElementById('avatar-input');
			el.value = null;
			el.click();
		},
		read () {
			this.file = this.$refs['avatar-input'].files[0];
			this.saveAvatar();
		},
		async saveAvatar() {
			const uploadUrl = await prefetch({
				contentType: this.file.type,
				mutation: `${PostStore}/${PostMutations.uploadURL}`,
				store: this.$store,
				type: 'getUploadUrl',
			});
			const response = await fetch(uploadUrl, {
				method: 'PUT',
				body: this.file,
			});
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			const img = new URL(uploadUrl);
			img.search = '';
			this.user.avatar = img.href;
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
		setImage (input) {
			this.input = input;
		},
		completeCompress(e) {
			const { info, dataUrl: image } = this.input;
			this.file = dataURItoBlob(image, info.type);
			this.saveAvatar();
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

.select-control >>> .v-input
	.v-input__control
		min-height 0 !important

	.v-input__slot
		margin-bottom 0
		padding 0 4px 0 12px
		background-color #ececec !important
		height 28px
		font-weight 600
		font-size 0.75rem

	.v-select__selections
		color black

	max-width 120px

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

.edit-icon-sec {
	position: absolute;
    right: 1px;
    top: 72px;
    background-color: #fff !important;
    padding: 5px;
    border-radius: 50%;
    box-shadow: 0px 1px 4px -1px #ccc;
	height: 28px;
    width: 28px;
}
</style>
