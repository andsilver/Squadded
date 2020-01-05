<template>
	<v-container v-if="socket.isAuth" grow>
		<BackBar ref="goback-button" :title="$t('Create')" />
		<Tabs :active="1" />
		<v-layout column grow class="mt-3">
			<Preloader v-if="loading" ref="preloader" class="mt-8" />
			<CapturePhoto v-show="!dataImg" @open="preview" />
			<Browse v-show="!dataImg" @open="preview" />
			<Tags v-if="dataImg" :post="post">
				<div class="photo-menu-panel">
					<v-btn icon width="40" height="40" @click="() => preview({})">
						<v-icon color="#000">
							sqdi-refresh
						</v-icon>
					</v-btn>
				</div>
			</Tags>
			<div v-if="dataImg && !loading" class="bottom photo-create">
				<SelectedItems ref="selected-items" />
				<UserInput v-model="text" :placeholder="$t('photo.textPlaceholder')" />
				<div class="controls">
					<PublicToggle ref="public-toggle" />
					<Button
						ref="done-button"
						class="mt-2"
						:disabled="!complete"
						@click.native="create"
					>
						{{ $t('Post') }}
					</Button>
				</div>
			</div>
		</v-layout>
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
	},
	data: () => ({
		dataImg: null,
		file: null,
		loading: false,
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
			return !!(this.text && this.getSelected.length);
		},
	},
	methods: {
		async create () {
			const url = await this.getUploadUrl();
			const img = await this.savePhoto(url);
			this.savePost(img);
		},
		getUploadUrl () {
			return prefetch({
				contentType: this.file.type,
				mutation: `${PostStore}/${PostMutations.uploadURL}`,
				store: this.$store,
				type: 'getUploadUrl',
			});
		},
		preview (data) {
			this.dataImg = data.image;
			this.post.img = data.image;
			this.file = data.file;
		},
		async savePhoto (url) {
			try {
				const response = await fetch(url, {
					method: 'PUT',
					body: this.file,
				});
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				const img = new URL(url);
				img.search = '';
				return img.href;
			} catch (error) {
				return error;
			}
		},
		async savePost (img) {
			const { text } = this;
			const { isPublic } = this.$refs['public-toggle'];
			const msg = {
				img,
				items: this.getSelected.map(post => post.item),
				private: !isPublic,
				text,
				type: 'galleryPost',
			};
			const post = await this.$store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
			this.$store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
			this.$router.push('/feed');
		},
	},
};
</script>

<style lang="stylus" scoped>
.photo-menu-panel
	display inline-block
	margin-right 20px
	box-shadow 0 6px 40px rgba(0, 0, 0, 0.15)
	border-radius 13px
.bottom
	position fixed
	width 100%
	z-index 999
	padding 0
	background #fff
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
</style>
