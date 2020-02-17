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
		<v-layout column>
			<div v-for="(post, n) in aggregatedItems" :id="'post_id_' + post.postId" :key="n">
				<component :is="getComponent(post)" :is-paired="paired" :post="post" />
				<Comments
					v-if="showComments(post) && !paired"
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
	}),
	computed: {
		aggregatedItems() {
			const groupsByAuthor = {};
			const items = [];

			if (!this.items || !this.items.length) {
				return [];
			}

			for (const item of this.items) {
				if (item.type !== 'singleItemPost') {
					items.push(item);
					continue;
				}

				if (!groupsByAuthor[item.userId]) {
					groupsByAuthor[item.userId] = {
						ts: item.ts,
						guid: item.guid,
						items: [item],
						type: 'groupedPosts',
					};
					continue;
				}

				const diff = Math.abs(
					+item.ts - +groupsByAuthor[item.userId].ts,
				);

				if (diff < MINUTES * 60 * 1000) {
					groupsByAuthor[item.userId].items.push(item);
				} else {
					items.push(item);
				}
			}

			Object.keys(groupsByAuthor).forEach((key) => {
				if (groupsByAuthor[key].items.length === 1) {
					items.push(groupsByAuthor[key].items[0]);
				} else {
					items.push(groupsByAuthor[key]);
				}
			});

			items.sort((a, b) => (a.ts > b.ts ? -1 : 1));

			return items;
		},
		image () {
			return this.$store.state.post.uploadingPicture;
		},
	},
	mounted() {
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
		},
		showComments(post) {
			return post.type && post.type !== 'groupedPosts' && !!this.getComponent(post);
		},
		closeViolationDialog() {
			this.$store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, null);
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
	position absolute
	top 20px
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
</style>
