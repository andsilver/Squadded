<template>
	<v-container v-if="socket.isAuth" grow>
		<div :class="{ hide_section : !showPhoto }" class="photo-main-sec">
			<BackBar ref="goback-bar" :title="$t( cropped ? 'New photo' : 'Create')" :close="!cropped" />
			<Tabs v-if="!cropped" :active="1" />
			<v-layout column grow class="mt-3">
				<Browse v-show="!dataImg" ref="browse" @open="preview" @error="fileTypeError = true" />
				<LargeButton
					v-if="!dataImg"
					:img="require('@/assets/img/video-upload.svg')"
					:label="$t('create.socialVideo')"
					class="post-upload video"
					@click.native="$router.push('/create/video')"
				/>
				<EmptyWishlist />
				<Tags v-if="dataImg" ref="tagsComponent" :post="post" :crop-active="cropActive" @doneCrop="doneCrop" />
				<p v-if="showError && getSelected.length === 0" class="tip-note error-note">
					{{ $t('tip.photoError') }}
				</p>
				<p v-if="LimitshowError" class="tip-note error-note">
					{{ $t('tip.photoLimitError') }}
				</p>
				<p v-if="fileTypeError" class="tip-note error-note">
					{{ $t('createDesc.unsupported_file_format') }}
				</p>
				<div class="bottom photo-create">
					<SelectedItems ref="selected-items" />
					<div class="button-section">
						<Button
							ref="next-button"
							class="next-button"
							:disabled="!complete"
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
					<PhotoView v-if="dataImg" ref="photo-view" :post="post" :coords="coords" />
					<Button
						ref="edit-button"
						style="width:26.46vw;"
						class="edit-button"
						@click.native="goBack"
					>
						{{ $t('Edit') }}
					</Button>
					<div class="controls bottom-post-sec">
						<PublicToggle ref="public-toggle" :public="!user.me.private" />
						<div class="bottom-fix button-section">
							<Button
								ref="done-button"
								class="post-button"
								:disabled="!complete || compressing"
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
import BackBar from '~/components/common/BackBar';
import Browse from '~/components/Create/Browse';
import Button from '~/components/common/Button';
import EmptyWishlist from '~/components/Create/EmptyWishlist';
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
import { compressImage } from '~/utils/compress-image';
import LargeButton from '~/components/common/LargeButton';
import { prefetch } from '~/helpers';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

const createPost = async ({ store, text, isPublic, selected, image, coords, needCompress }) => {
	try {
		store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, image);
		const img = await compressImage({ maxWidth: 500, image, store, dontCompress: !needCompress });
		const msg = {
			img,
			items: selected.map(post => post.item),
			private: !isPublic,
			text,
			type: 'galleryPost',
			coords,
		};
		const post = await store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
		post.ts = Date.now();
		store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, null);
		store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
	} catch (err) {
		store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, null);
	}
};

export default {
	components: {
		BackBar,
		Browse,
		Button,
		EmptyWishlist,
		PublicToggle,
		SelectedItems,
		Tabs,
		Tags,
		UserInput,
		PhotoView,
		LargeButton,
	},
	data: () => ({
		dataImg: null,
		cropActive: false,
		file: null,
		showPhoto: true,
		showError: false,
		LimitshowError: false,
		fileTypeError: false,
		post: new FeedPost({
			type: 'galleryPost',
			img: '',
		}),
		text: '',
		input: null,
		compressing: false,
		cropped: false,
		needCompress: true,
		coords: [],
	}),
	computed: {
		...mapGetters([
			ActivityGetters.getSelected,
		]),
		...mapState([
			'socket',
			'user',
		]),
		complete () {
			return !!(this.getSelected.length);
		},
	},
	created () {
		this.$root.$on('selectProducts', data => this.selectProducts(data));
		prefetch({
			store: this.$store,
			type: 'fetchWishlist',
		});
	},
	methods: {
		create () {
			let { coords } = this.$refs.tagsComponent;
			if (coords && coords.length) {
				coords = coords.filter(c => c.id);
			}
			createPost({
				store: this.$store,
				text: this.text,
				isPublic: this.$refs['public-toggle'].isPublic,
				selected: this.getSelected,
				image: this.dataImg,
				coords,
				needCompress: this.needCompress,
			});
			this.$router.push({
				path: '/feed',
			});
		},
		preview (data) {
			if (!data) {
				return;
			}
			this.fileTypeError = false;
			this.dataImg = data.image;
			this.post.img = data.image;
			this.file = data.file;
			this.cropActive = true;

			if (data.file && data.file.size) {
				this.needCompress = data.file.size > 1024 * 250;
			}
		},
		doneCrop(data) {
			this.preview(data);
			this.cropActive = false;
			if (data) {
				this.cropped = true;
			} else {
				this.dataImg = null;
			}
		},
		next () {
			this.coords = this.$store.state.post.coords_set;
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
	z-index 200
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

@media screen and (max-width: 280px) {
	.edit-button {
		width: 29.46vw !important;
	}
}
</style>
