<template>
	<v-container class="pd">
		<v-layout
			v-if="socket.isAuth && user.guid"
			column
		>
			<div class="login">
				<div class="text-center">
					<div class="brand-section">
						<img src="../assets/img/bglogin.svg" class="b-logo">
						<div class="select-user-icon-sec">
							<img v-if="user.avatar" ref="user-avatar" :src="userAvatar" class="select-user-icon">
							<div v-if="!user.avatar" ref="user-avatar" :class="{ dummy_image: !user.avatar }" class="select-user-icon" />
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
							<ImageUploader
								v-show="false"
								ref="resizer"
								:max-width="600"
								accept="image/jpeg,image/jpg,image/png"
								output-format="verbose"
								auto-rotate
								@input="setImage"
								@onComplete="completeCompress"
							/>
							<PopMenu ref="avatar-upload-btn" :compressing="compressing" @fileUpload="openFileUpload" />
							<!-- <v-btn ref="avatar-upload-btn" class="edit-icon-sec" icon @click="openFileUpload">
								<img src="../assets/img/action-edit.svg" class="edit-icon-image">
							</v-btn> -->
							<p class="user_name">
								@{{ username }}
							</p>
						</div>
					</div>
				</div>
				<div ref="pick-username-sec" class="pick-username-sec">
					<h4>
						{{ $t('PickUsername') }}
					</h4>
					<span>{{ $t('StartBuildingYourSquad') }}</span>
				</div>
				<div class="username-form-sec">
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
					<span class="comment-msg">{{ $t('YouCanAlwaysChange') }}</span>
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
				<ImageCrop v-if="avatarImg" :img="avatarImg" @doneCrop="doneCrop" />
			</v-dialog>
		</v-layout>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import ImageUploader from 'vue-image-upload-resize';
import PopMenu from '../components/UserProfile/EditPopMenu';
import ImageCrop from '~/components/ProfileSettings/ImageCrop';
import { dataURItoBlob } from '~/utils/dataUriToBlob';
import { UserStore, UserActions } from '~/store/user';
import { PostStore, PostMutations } from '~/store/post';
import { prefetch } from '~/helpers';
import { toBase64 } from '~/utils/toBase64';
import { toFile } from '~/utils/toFile';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		ImageUploader,
		PopMenu,
		ImageCrop,
	},
	data: () => ({
		user: null,
		file: null,
		submitted: false,
		input: null,
		username: null,
		avatarImg: null,
		avatarFile: null,
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
		const userName = this.user.name.split('@');
		this.username = userName[0];
	},
	methods: {
		openFileUpload(type) {
			this.$refs[`${type}-input`].value = null;
			this.$refs[`${type}-input`].click();
		},
		async saveProfile() {
			this.user.name = this.username;
			if (!this.user.name || !this.user.avatar) {
				this.submitted = true;
				return;
			}
			this.user.nameSelected = true;
			await this.$store.dispatch(
				`${UserStore}/${UserActions.setProfile}`,
				this.user,
			);
			this.$router.push('/create-your-squad');
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
			this.compressing = false;
		},
		setImage (input) {
			this.input = input;
		},
		completeCompress(e) {
			const { info, dataUrl: image } = this.input;
			this.file = dataURItoBlob(image, info.type);
			this.saveAvatar();
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
			const file = await toFile(image, 'file');
			this.$refs.resizer.uploadFile({
				target: {
					files: [file],
				},
			});
		},
	},
	head: () => ({
		title: 'Onboarding-Username',
	}),
};
</script>

<style lang="stylus">
.brand-section
	border-radius 4vw
	position relative
	.brand-title
		font-family: 'Montserrat', sans-serif
		font-weight: 600
		font-size: 4.61vw
		line-height: 3.66vw
		padding-bottom: 3.27vw
	img.b-logo
		width 100%
		height 45.84vw
	.user_name
		color #B8B8BA
		font-size 3.69vw
		font-weight 400
.pick-username-sec
	text-align center
	margin 25vw auto 0
	width 90%
	h4
		font-size 4.30vw
		font-weight 700
	span
		font-size 3.69vw
		color #000
		line-height 4.92vw
		margin-top 5.38vw
		display: block
.select-user-icon-sec
	width 27.69vw
	height 27.69vw
	display block
	position absolute
	z-index 10
	bottom -35px
	left 50%
	transform translateX(-50%)
	.select-user-icon
		width 100%
		height 100%
		border-radius 50%
		border 0.92vw solid #fff
		background-color #F5F5F5
	.edit-icon-sec
		position absolute
		bottom 0
		width 8.15vw
		height 8.15vw
		z-index 1
		background #fff !important
		display flex
		right 0
		align-items center
		justify-content center
		border-radius 50%
		box-shadow 0 0.92vw 6.15vw rgba(0,0,0,0.10)
		img.edit-icon-image
			width 4.38vw
			height 4.38vw
.username-form-sec
	padding 0 3.2vw
	margin-top 7.23vw
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
		text-align center
		display block
		margin 2.26vw auto 5.89vw
		font-size 3.38vw
		width 90%
	.done-btn
		width 43.84vw
		height 12.30vw !important
		border-radius 3.07vw
		margin 0 auto
		display block
		font-size 2.61vw !important
		letter-spacing 2px
		text-transform uppercase !important
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
		top 47vw !important
		left 5vw !important
.dummy_image
	background-image url('../assets/img/dummy_avater.svg')
	background-position center
	background-size 55%
	background-repeat no-repeat
</style>
