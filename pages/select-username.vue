<template>
	<v-container class="pd">
		<v-layout
			v-if="socket.isAuth && user.guid"
			column
		>
			<div class="login">
				<div class="text-center">
					<div class="font-weight-bold white--text black py-4">
						{{ $t('select_username.create_your_profile') }}
					</div>
					<div ref="pick-username-sec" class="brand-section d-flex flex-column align-center">
						<div class="user-avatar">
							<img v-if="user.avatar" ref="user-avatar" :src="userAvatar" class="select-user-icon">
							<div v-if="!user.avatar" ref="user-avatar" :class="{ dummy_image: !user.avatar }" class="select-user-icon" />
							<PopMenu ref="avatar-upload-btn" class="pop-menu" :compressing="compressing" @fileUpload="openFileUpload" />
						</div>
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
						<p class="user_name font-weight-bold">
							@{{ username }}
						</p>
					</div>
				</div>
				<div class="px-4 mt-4">
					<v-text-field
						ref="username-field"
						v-model="username"
						:label="$t('EnterUsername')"
						required
						solo
						flat
						dense
						class="username-field"
						:class="{ invalid: showError }"
						hide-details
					/>
					<span v-if="showError" class="error-message">{{ $t('form.rules.name.valid') }}</span>
					<div class="comment-msg text-center px-6 mt-3 mb-6">
						{{ $t('YouCanAlwaysChange') }}
					</div>
					<v-btn
						ref="save-btn"
						class="full-width done-btn"
						color="primary"
						large
						depressed
						@click="saveProfile"
					>
						{{ $t('form.done') }}
					</v-btn>
				</div>
			</div>
			<v-dialog v-model="showCropper" content-class="cropper-dialog">
				<ImageCrop v-if="avatarImg" ref="image-crop" :img="avatarImg" @doneCrop="doneCrop" />
			</v-dialog>
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import PopMenu from '../components/UserProfile/EditPopMenu';
import ImageCrop from '~/components/ProfileSettings/ImageCrop';
import { UserStore, UserActions } from '~/store/user';
import { toBase64 } from '~/utils/toBase64';
import { compressImage } from '~/utils/compress-image';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		PopMenu,
		ImageCrop,
	},
	data: () => ({
		user: null,
		submitted: false,
		username: null,
		avatarImg: null,
		showCropper: false,
		compressing: false,
	}),
	computed: {
		...userState([
			'me',
		]),
		...mapState([
			'socket',
		]),
		userAvatar() {
			return this.user.avatar || '/widget/_nuxt/assets/img/dummy_avater.svg';
		},
		showError() {
			return this.submitted && this.user && !this.username;
		},
	},
	created () {
		this.user = Object.assign({}, this.me);
		const userName = this.user.screenName.split('@');
		this.username = userName[0];
	},
	mounted () {
		this.$root.$emit('hideToolbarHide', {});
	},
	methods: {
		openFileUpload(type) {
			this.$refs[`${type}-input`].value = null;
			this.$refs[`${type}-input`].click();
		},
		async saveProfile() {
			this.user.screenName = this.username;
			if (!this.user.screenName) {
				this.submitted = true;
				return;
			}
			this.user.nameSelected = true;
			await this.$store.dispatch(
				`${UserStore}/${UserActions.setProfile}`,
				this.user,
			);
			this.$router.push('/invite-friends');
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
	head: () => ({
		title: 'Onboarding-Username',
	}),
};
</script>

<style lang="stylus">
.brand-section
	position relative
	margin-top 10vh
	.user_name
		color #B8B8BA
		font-size 3.69vw
		font-weight 400
.select-user-icon
	width 100px
	height 100px
	border-radius 50%
	border 0.92vw solid #fff
	background-color #F5F5F5
.user-avatar
	position relative
	.pop-menu
		position absolute
		bottom 0
		right 0
		.edit-icon-sec
			background white
			img
				width 20px

.username-field
	border 0.30vw solid #DBDBDB
	border-radius 3.07vw
	height 10.76vw
	input, label
		font-size 3.69vw
		color #000000 !important
		width 100%
		text-align center
		margin-top 2px
	.v-input__control
		height 10.76vw !important
		min-height auto !important
	input
		font-weight 500
	&.invalid
		border 1px solid #FD6256
.comment-msg
	color #B8B8BA
	font-size 12px
	font-weight 600
.done-btn
	width 43.84vw
	border-radius 3.07vw
	margin 0 auto
	display block
	font-size 2.61vw !important
	letter-spacing 2px
	font-weight 700
.error-message
	background #FD6256
	border-radius 1.53vw
	height 6.76vw
	text-align center
	font-size 3.38vw
	color #fff
	display flex
	align-items center
	justify-content center
	font-weight 500
	line-height 4.61vw
	margin-top 3.07vw
.container.pd
	padding 0 !important
	.v-menu__content
		top: calc(10vh + 115px) !important;
		left: 21px !important;
.dummy_image
	background-image url('../assets/img/dummy_avater.svg')
	background-position center
	background-size 55%
	background-repeat no-repeat
</style>
