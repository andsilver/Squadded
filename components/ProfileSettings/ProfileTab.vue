<template>
	<div v-if="user" class="py-4 profile-content">
		<div class="pa-3">
			<section ref="uploader" class="fixed_profile d-flex justify-center">
				<v-avatar ref="user-avatar" class="user_avatar" width="100px" height="100px" min-width="none">
					<v-img :key="user.avatar" :src="user.avatar" />
				</v-avatar>
				<v-menu
					v-model="menu"
					:attach="$refs.uploader"
					origin="right top"
					transition="scale-transition"
					content-class="photo-menu"
				>
					<template v-slot:activator="{ on }">
						<v-btn ref="avatar-upload-btn" class="edit-icon-sec" icon :loading="compressing" v-on="on">
							<img src="../../assets/img/action-edit.svg" class="edit-icon-image" width="14px" height="14px">
						</v-btn>
					</template>

					<v-list>
						<v-list-item class="pr-1">
							<v-list-item-title class="d-flex justify-space-between align-center">
								<span class="input-label">{{ $t('photo.update') }}</span>
								<v-btn icon>
									<img src="../../assets/img/action-edit.svg" class="edit-icon-image" width="14px" height="14px">
								</v-btn>
							</v-list-item-title>
						</v-list-item>
						<v-list-item class="py-3">
							<v-list-item-title class="d-flex align-center" @click="upload('capture')">
								<v-icon small color="black">
									mdi-cellphone-screenshot
								</v-icon>
								<span class="caption font-weight-medium ml-2 black--text">{{ $t('photo.capture') }}</span>
							</v-list-item-title>
						</v-list-item>
						<v-divider />
						<v-list-item class="py-3">
							<v-list-item-title class="d-flex align-center" @click="upload('browse')">
								<v-icon small color="black">
									mdi-image
								</v-icon>
								<span class="caption font-weight-medium ml-2 black--text">{{ $t('photo.browse') }}</span>
							</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
				<input
					v-show="false"
					ref="browse-input"
					type="file"
					accept="image/jpeg,image/jpg,image/png"
					@change="() => onPhotoUpload('browse')"
				>
				<input
					v-show="false"
					ref="capture-input"
					type="file"
					capture="camera"
					accept="image/jpeg,image/jpg,image/png"
					@change="() => onPhotoUpload('capture')"
				>
			</section>
		</div>
		<div class="form-area px-4">
			<section>
				<label class="input-label" for="name">{{ $t('form.instagram_username') }}</label>
				<v-text-field
					id="instagram_username"
					ref="instagram-username-field"
					v-model="user.screenName"
					class="username-input profile-input"
					outlined
					dense
					:rules="[required]"
				/>
			</section>
			<section>
				<label class="input-label" for="bio">{{ $t('form.bio') }}</label>
				<v-text-field
					id="bio"
					ref="bio-field"
					v-model="user.bio"
					class="profile-input"
					outlined
					dense
				/>
			</section>
			<section>
				<label class="input-label" for="instagram_username">{{ $t('form.name') }}</label>
				<v-text-field
					id="name"
					ref="name-field"
					v-model="user.name"
					class="profile-input"
					outlined
					dense
				/>
			</section>
			<section class="mt-4 d-flex">
				<div class="mr-2">
					<v-btn icon>
						<v-icon small color="black">
							{{ user.private ? 'mdi-lock-outline': 'mdi-web' }}
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
						ref="private-description"
						class="mt-2 input-label"
					>
						{{ user.private ? $t('profile_settings.private_profile.description') : $t('profile_settings.public_profile.description') }}
					</div>
				</div>
			</section>
		</div>
		<v-dialog v-model="showCropper" content-class="cropper-dialog">
			<ImageCrop v-if="avatarImg" :img="avatarImg" @doneCrop="doneCrop" />
		</v-dialog>
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import ImageCrop from './ImageCrop';
import { UserStore } from '~/store/user';
import { toBase64 } from '~/utils/toBase64';
import { compressImage } from '~/utils/compress-image';

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	components: {
		ImageCrop,
	},
	data: () => ({
		user: null,
		profileTypes: [
			{ value: false, name: 'Public' },
			{ value: true, name: 'Private' },
		],
		editing: false,
		menu: false,
		avatarImg: null,
		showCropper: false,
		compressing: false,
		required: null,
	}),
	computed: {
		...mapState(['me']),
	},
	watch: {
		me() {
			this.user = Object.assign({}, this.me);
		},
		user: {
			deep: true,
			handler() {
				this.editing = Object.keys(this.user).some(k => this.user[k] !== this.me[k]);
			},
		},
	},
	mounted () {
		this.user = Object.assign({}, this.me);
		this.required = value => !!value || this.$t('form.rules.name.valid');
	},
	methods: {
		togglePublic() {
			this.user.private = !this.user.private;
			this.user = Object.assign({}, this.user);
		},
		upload (type) {
			this.$refs[`${type}-input`].value = null;
			this.$refs[`${type}-input`].click();
		},
		async onPhotoUpload (type) {
			const file = this.$refs[`${type}-input`].files[0];
			if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
				return;
			}
			const base64 = await toBase64(file);
			this.avatarImg = base64.length ? base64 : null;
			this.showCropper = true;
		},
		async doneCrop (data) {
			this.showCropper = false;
			if (!data) {
				this.file = null;
				this.avatarImg = null;
				return;
			}
			const { image } = data;
			this.compressing = true;
			[this.user.avatar, this.user.miniAvatar] = await Promise.all([
				compressImage({ maxWidth: 400, image, store: this.$store }),
				compressImage({ maxWidth: 50, image, store: this.$store }),
			]);
			this.compressing = false;
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
	z-index: 99;
	border: 3px solid white;
	border-radius: 50%;
	background: white;
	position: relative;

	.edit-icon-sec {
		position: absolute;
		right: 35%;
		bottom: 0;
		background-color: #fff !important;
		box-shadow: 0px 1px 4px -1px #ccc;
		height: 28px;
		width: 28px;
	}
}

.photo-menu
	left 39px !important
	top 60px !important
	width 180px
	.v-list-item
		cursor pointer

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

.v-input__control
	border-radius 10px

.input-label {
	color: #9e9e9e;
	font-weight: 500;
	font-size: 3.38vw;
}

>>> .v-text-field.v-text-field--enclosed .v-text-field__details
	margin-bottom 0 !important
	min-height auto
	.v-messages
		min-height auto

section .v-btn
	background-color rgba(218, 217, 221, 0.3)
	color black
	font-weight 600

.profile-input
	margin-top 1.30vw
	margin-bottom 3.3vw
</style>
