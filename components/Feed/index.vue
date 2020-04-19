<template>
	<section class="feed" :class="{ grid_gallery: paired}" @scroll="onScroll">
		<v-btn
			v-if="loadNew"
			ref="load-new-button"
			class="load-new-button"
			:elevation="19"
			rounded
			@click="loadNewItems"
		>
			{{ $t('NewPosts') }}
		</v-btn>
		<UploadingDone v-if="image && image !== 'violation'" ref="uploading-done" :image="image" />
		<v-layout column class="gallery_layout">
			<div v-for="(post, n) in aggregatedItems" :id="'post_id_' + (post.postId || 'group')" ref="post" :key="n">
				<component
					:is="getComponent(post)"
					ref="component"
					:is-paired="paired"
					:post="post"
				/>
				<Comments
					v-if="showComments(post) && !paired"
					ref="comments"
					:post="post"
					:show-all="false"
					:for-feed="true"
				/>
			</div>
		</v-layout>
		<ViolationDialog v-if="image === 'violation'" ref="violation" @close="closeViolationDialog" />
	</section>
</template>

<script>
import UploadingDone from './UploadingDone';
import ViolationDialog from './ViolationDialog';
import GalleryPost from '~/components/Posts/GalleryPost';
import MultiItemPost from '~/components/Posts/MultiItemPost';
import SingleItemPost from '~/components/Posts/SingleItemPost';
import PollPost from '~/components/Posts/PollPost';
import GroupedPosts from '~/components/Posts/GroupedPosts';
import Comments from '~/components/Comments';
import { PostStore, PostMutations } from '~/store/post';

const MINUTES = 2; // 2 minutes

export default {
	name: 'Feed',
	components: {
		SingleItemPost,
		GroupedPosts,
		PollPost,
		MultiItemPost,
		GalleryPost,
		Comments,
		UploadingDone,
		ViolationDialog,
	},
	props: {
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		paired: {
			type: Boolean,
			default: false,
		},
		loadNew: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		components: {
			singleItemPost: SingleItemPost,
			groupedPosts: GroupedPosts,
			pollPost: PollPost,
			outfitPost: MultiItemPost,
			galleryPost: GalleryPost,
		},
		showCommentInputTimeout: null,
	}),
	computed: {
		aggregatedItems() {
			const groupsByAuthor = {};
			const items = [];

			if (!this.items || !this.items.length) {
				return [];
			}

			let index = 0;

			for (const item of this.items) {
				if (item.type !== 'singleItemPost') {
					items.push(item);
					index++;
					continue;
				}

				if (!groupsByAuthor[item.userId]) {
					groupsByAuthor[item.userId] = {
						index,
						ts: item.ts,
						guid: item.guid,
						items: [item],
						type: 'groupedPosts',
					};
					items.push(item);
					index++;
					continue;
				} else {
					const diff = Math.abs(
						+item.ts - +groupsByAuthor[item.userId].ts,
					);

					if (diff > MINUTES * 60 * 1000) {
						continue;
					}
					const single = items[groupsByAuthor[item.userId].index];

					if (single.type === 'groupedPosts') {
						single.items.push(item);
						continue;
					}
					items[groupsByAuthor[item.userId].index] = groupsByAuthor[item.userId];
					items[groupsByAuthor[item.userId].index].items.push(item);
				}
			}

			return items;
		},
		image () {
			return this.$store.state.post.uploadingPicture;
		},
	},
	mounted() {
		this.checkCommentInput();
		window.addEventListener('scroll', this.onScroll);
	},
	destroyed() {
		window.removeEventListener('scroll', this.onScroll);
	},
	methods: {
		getComponent(post) {
			return this.components[post.type];
		},
		onScroll () {
			this.checkCommentInput();
			const bottomOfWindow = Math.max(
				window.pageYOffset,
				document.documentElement.scrollTop,
				document.body.scrollTop,
			) + window.innerHeight === document.documentElement.offsetHeight;
			if (bottomOfWindow) {
				this.$emit('loadMore');
			}
		},
		loadNewItems() {
			this.$emit('loadNew');
			document.documentElement.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		},
		showComments(post) {
			return post.type && post.type !== 'groupedPosts' && !!this.getComponent(post);
		},
		closeViolationDialog() {
			this.$store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, null);
		},
		checkCommentInput () {
			if (!this.$refs.post) {
				return;
			}
			const elements = this.$refs.post
				.map((element, index) => ({
					index,
					element,
					overlap: this.overlap(element),
				}))
				.filter(e => e.overlap)
				.sort((a, b) => b.overlap - a.overlap);
			const element = elements[0];
			this.setShowCommentInput(element);
		},
		overlap (element) {
			const view = {
				top: document.documentElement.scrollTop - 70,
				bottom: document.documentElement.scrollTop + window.innerHeight - 70 - 65,
			};
			const self = {
				top: element.offsetTop + 40,
				bottom: element.offsetTop + 40 + element.offsetHeight,
			};

			if (
				(self.top >= view.top && self.top <= view.bottom) &&
				(self.bottom >= view.top && self.bottom <= view.bottom)
			) {
				return 1000;
			}

			if (self.top >= view.top && self.top <= view.bottom) {
				return view.bottom - self.top;
			}

			if (self.bottom >= view.top && self.bottom <= view.bottom) {
				return self.bottom - view.top;
			}
			return 0;
		},
		setShowCommentInput (item) {
			this.showCommentInputTimeout && clearTimeout(this.showCommentInputTimeout);
			if (!item) {
				return;
			}
			let comment;
			if (item.element.id.includes('group')) {
				comment = (this.$refs.component || []).find(c => c.$el.parentNode === item.element);
			} else {
				comment = (this.$refs.component || []).find(c => c.$el.parentNode === item.element);
			}
			if (!comment) {
				return;
			}
			this.showCommentInputTimeout = setTimeout(() => {
				if (comment.$refs['post-comments']) {
					comment.$refs['post-comments'].showInput = true;
				} else {
					comment.showInput = true;
				}
			}, 4000);
		},
	},
};
</script>

<style lang="stylus" scoped>
.feed
	position relative
	width 100%
	&.grid_gallery
		columns 2
		-webkit-columns 2
		-moz-columns 2
		column-gap 3.07vw
		-webkit-column-gap 3.07vw
		-moz-column-gap 3.07vw

.load-new-button
	padding 0 6.5vw !important
	height 8.92vw !important
	position fixed
	top 72px
	left 50%
	z-index 9
	text-transform none
	-webkit-transform translate(-50%,-50%)
	-ms-transform translate(-50%,-50%)
	-o-transform translate(-50%,-50%)
	transform translate(-50%,-50%)
	-webkit-transition auto
	transition auto
	background-color #fff !important
	letter-spacing 0
	font-size 4VW
	font-weight 600
	box-shadow 0 0.92vw 4.61vw rgba(0,0,0,.25) !important
.gallery_layout
	display block
</style>
