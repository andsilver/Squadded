<template>
	<v-container v-if="socket.isAuth" grow>
		<div :class="{ hide_section : !showPhoto }" class="photo-main-sec">
			<BackBar ref="goback-bar" :title="$t('Create')" />
			<Tabs :active="1" />
			<v-layout column grow class="mt-3">
				<CapturePhoto v-show="!dataImg" ref="capture-photo" @open="preview" />
				<Browse v-show="!dataImg" ref="browse" @open="preview" />
				<Tags v-if="dataImg" ref="tagsComponent" :post="post" :crop-active="cropActive" @doneCrop="cropActive=false">
					<div class="photo-menu-panel">
						<v-btn icon width="40" height="40" @click="() => preview({})">
							<v-icon color="#000">
								sqdi-refresh
							</v-icon>
						</v-btn>
						<v-btn icon width="40" height="40" @click="() => cropActive = !cropActive">
							<v-icon :color="cropActive? '#fd756a' : '#000'">
								mdi-crop
							</v-icon>
						</v-btn>
					</div>
				</Tags>
				<p v-if="showError && getSelected.length === 0" class="tip-note error-note">
					{{ $t('tip.photoError') }}
				</p>
				<p v-if="LimitshowError" class="tip-note error-note">
					{{ $t('tip.photoLimitError') }}
				</p>
				<div class="bottom photo-create">
					<SelectedItems ref="selected-items" />
					<div class="button-section">
						<Button
							ref="next-button"
							class="next-button"
							:class="{ disable_btn :!complete}"
							@click.native="next"
						>
							{{ $t('Next') }}
						</Button>
					</div>
				</div>
			</v-layout>
		</div>
		<div :class="{ hide_section : showPhoto }" class="photo-main-sec">
			<v-layout column grow class="mt-3">
				<h2>
					<v-btn ref="go-back-btn" icon @click="goBack">
						<v-icon>
							sqdi-arrow-pointing-to-left
						</v-icon>
					</v-btn>
					{{ $t('NewPost') }}
				</h2>
				<div v-if="dataImg" class="photo-create">
					<UserInput ref="user-input" v-model="text" :placeholder="$t('photo.textPlaceholder')" class="input-section" />
					<PhotoView v-if="dataImg" ref="photo-view" :post="post" />
					<Button
						ref="edit-button"
						class="edit-button"
						@click.native="goBack"
					>
						{{ $t('Edit') }}
					</Button>
					<div class="controls bottom-post-sec">
						<PublicToggle ref="public-toggle" />
						<div class="bottom-fix button-section">
							<Button
								ref="done-button"
								class="post-button"
								:disabled="!complete"
								@click.native="create"
							>
								{{ $t('Post') }}
							</Button>
						</div>
					</div>
				</div>
			</v-layout>
		</div>
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import CapturePhoto from '~/components/Create/CapturePhoto';
import BackBar from '~/components/common/BackBar';
import Browse from '~/components/Create/Browse';
import Button from '~/components/common/Button';
import PublicToggle from '~/components/Create/PublicToggle';
import SelectedItems from '~/components/Create/SelectedItems';
import Tabs from '~/components/Create/Tabs';
import Tags from '~/components/Create/Tags';
import UserInput from '~/components/common/UserInput';
import PhotoView from '~/components/common/PhotoView';
import { FeedPost } from '~/classes/FeedPost';
import { ActivityStore, ActivityGetters } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import {
	PostStore,
	PostActions,
	PostMutations,
} from '~/store/post';
import { prefetch } from '~/helpers';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

const createPost = async ({ file, store, text, isPublic, selected, image }) => {
	try {
		store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, image);
		const url = await prefetch({
			contentType: file.type,
			mutation: `${PostStore}/${PostMutations.uploadURL}`,
			store: store,
			type: 'getUploadUrl',
		});
		const response = await fetch(url, {
			method: 'PUT',
			body: file,
		});
		if (!response.ok) {
			store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, null);
			return;
		}
		const img = new URL(url);
		img.search = '';
		const msg = {
			img: img.href,
			items: selected.map(post => post.item),
			private: !isPublic,
			text,
			type: 'galleryPost',
		};
		await store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
		store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, null);
		store.commit(`${FeedStore}/${FeedMutations.addItem}`, msg);
	} catch (err) {
		store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, null);
	}
};

export default {
	components: {
		CapturePhoto,
		BackBar,
		Browse,
		Button,
		PublicToggle,
		SelectedItems,
		Tabs,
		Tags,
		UserInput,
		PhotoView,
	},
	data: () => ({
		dataImg: null,
		cropActive: false,
		file: null,
		showPhoto: true,
		showError: false,
		LimitshowError: false,
		post: new FeedPost({
			type: 'galleryPost',
			img: '',
		}),
		text: '',
	}),
	computed: {
		...mapGetters([
			ActivityGetters.getSelected,
		]),
		...mapState([
			'socket',
		]),
		complete () {
			return !!(this.getSelected.length);
		},
	},
	created () {
		this.$root.$on('selectProducts', data => this.selectProducts(data));
	},
	methods: {
		create () {
			createPost({
				file: this.file,
				store: this.$store,
				text: this.text,
				isPublic: this.$refs['public-toggle'].isPublic,
				selected: this.getSelected,
				image: this.dataImg,
			});
			this.$router.push({
				path: '/feed',
			});
		},
		preview (data) {
			this.dataImg = data.image;
			this.post.img = data.image;
			this.file = data.file;
		},
		next () {
			if (this.dataImg && this.getSelected.length === 0) {
				this.showError = true;
				this.$refs.tagsComponent.toggleShifted();
			} else if (this.dataImg && this.getSelected.length) {
				this.showError = false;
				this.showPhoto = false;
			}
		},
		goBack() {
			this.showPhoto = true;
		},
		selectProducts(options) {
			if (this.getSelected.length >= 2 && !options) {
				this.LimitshowError = false;
			} else if (options) {
				this.LimitshowError = true;
			}
		},
	},
	head: () => ({
		title: 'Create-Photo',
	}),
};
</script>

<style lang="stylus" scoped>
.hide_section
	display none
.photo-menu-panel
	display inline-block
	margin-right 20px
	box-shadow 0 6px 40px rgba(0, 0, 0, 0.15)
	border-radius 13px
.show-tabs
	.bottom
		position fixed
.bottom
	width 100%
	z-index 999
	padding 0
	bottom 0
	left 0
	right 0
	.controls
		display flex
		align-items center
		width 100%
		bottom 0
		padding 3.461vw 4.1538vw
		margin-top 3.69vh
		button
			width 50%
.bottom-fix
	position fixed
	width 100%
	z-index 999
	padding 0
	bottom 0
	left 0
	right 0
	.post-button
		width 42.46vw;
		height 12.30vw !important
		display block
.tip-note
	font-size 3.384vw
	font-weight 600
	margin-bottom 0
	margin-top 8px
	text-align center
	&.error-note
		color #FD6256
.button-section
	padding-bottom 6.15vw
	padding-top: 3.46vw
	background-color: #fff
.next-button
	width 42.46vw;
	height 12.30vw !important
	display block
	&.disable_btn
		background-color rgba(184,184,186,0.3) !important
.photo-main-sec h2
	color #000
	font-size 4.307vw
	font-weight bold
	text-align center
	padding-bottom 0px
	position relative
	line-height 36px
	width 100%
	button
		position absolute
		left 0

.edit-button
	background-image url('~assets/img/refresh-icon.svg')
	background-color transparent !important
	width 23.07vw
	color #000
	border 2px solid #000
	font-size 2.15vw
	background-repeat no-repeat
	background-position 4vw
	padding-left 10vw !important
	background-size 3.69vw
	display block
.controls.bottom-post-sec
	display flex
	align-items center
	width 100%
	bottom 0
	padding 4VW 0
	margin-top 4VW
	border-top 0.46vw solid #DBDBDB

.photo-menu-panel button
	display block
</style>
