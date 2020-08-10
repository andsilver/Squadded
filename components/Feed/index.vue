<template>
	<section class="feed" :class="{ grid_gallery: paired }">
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
			<LoadMore
				ref="vueLoad"
				:top-change-text="topChangeText"
				@top-method="handleTopRefresh"
			>
				<div v-for="(post, n) in aggregatedItems" :id="'post_id_' + getId(post)" ref="post" :key="n">
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
						for-feed
					/>
				</div>
			</LoadMore>
		</v-layout>
		<ViolationDialog v-if="image === 'violation'" ref="violation" @close="closeViolationDialog" />
	</section>
</template>

<script>
import UploadingDone from './UploadingDone';
import ViolationDialog from './ViolationDialog';
import { LOADING_TIMEOUT, GROUP_ITEMS_TIME_RANGE } from '~/consts/time-values';
import Comments from '~/components/Comments';
import { PostStore, PostMutations } from '~/store/post';

import { getComponent } from '~/services/post';
import LoadMore from '~/components/LoadMore';

export default {
	name: 'Feed',
	components: {
		Comments,
		UploadingDone,
		ViolationDialog,
		LoadMore,
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
		showCommentInputTimeout: null,
		scrollTimeout: null,
		lastIndex: null,
		storageKey: null,
		scrollContainer: null,
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

					if (diff > GROUP_ITEMS_TIME_RANGE) {
						delete groupsByAuthor[item.userId];
						items.push(item);
						index++;
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
		topChangeText() {
			return {
				pulling: 'mdi-arrow-down',
				limit: 'mdi-arrow-collapse-down',
				loading: 'mdi-timer-sand',
				complete: '',
			};
		},
	},
	mounted() {
		this.scrollContainer = document.getElementById('main');
		this.storageKey = `saved_post_${this.$route.name}`;
		this.scrollToPost();
		this.checkCommentInput();
		window.addEventListener('beforeunload', this.savePosition);

		this.scrollContainer.addEventListener('scroll', this.onScroll);
	},
	destroyed() {
		this.scrollContainer.removeEventListener('scroll', this.onScroll);
		window.removeEventListener('beforeunload', this.savePosition);
		this.savePosition();
	},
	methods: {
		handleTopRefresh() {
			this.$emit('loadNew');
			setTimeout(() => this.$refs.vueLoad.onTopLoaded(0), LOADING_TIMEOUT);
			this.scrollContainer.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		},
		getId(post) {
			return post.postId ? post.postId
				: post.items ? `${post.items[0].guid}_group`
				: post.correlationId;
		},
		getComponent,
		savePosition() {
			if (!['feed', 'all'].some(item => this.storageKey.includes(item))) {
				return;
			}
			if (this.lastIndex > 2) {
				const post = this.aggregatedItems[this.lastIndex];
				sessionStorage.setItem(this.storageKey, `post_id_${this.getId(post)}`);
			} else {
				sessionStorage.removeItem(this.storageKey);
			}
		},
		onScroll () {
			clearTimeout(this.showCommentInputTimeout);
			clearTimeout(this.scrollTimeout);

			this.scrollTimeout = setTimeout(() => {
				this.checkCommentInput();
			});
		},
		loadNewItems() {
			this.$emit('loadNew');
			this.scrollContainer.scrollTo({
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
			const posts = this.$refs.post;
			const elements = posts
				.map((element, index) => ({
					index,
					element,
					overlap: this.overlap(element),
				}))
				.filter(e => e.overlap)
				.sort((a, b) => b.overlap - a.overlap);

			for (const el of elements) {
				if (this.setShowCommentInput(el)) {
					this.lastIndex = el.index;
					break;
				}
			}

			if (elements.find(el => el.index === posts.length - 1)) {
				this.$emit('loadMore');
			}
		},
		overlap (element) {
			const view = {
				top: this.scrollContainer.scrollTop - 70,
				bottom: this.scrollContainer.scrollTop + window.innerHeight - 70 - 65,
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
		scrollToPost () {
			const key = this.storageKey;
			const openedPostId = sessionStorage.getItem(key);
			sessionStorage.removeItem(key);

			if (!openedPostId) {
				return this.scrollContainer.scrollTo(0, 0);
			}

			try {
				const postElement = this.$el.querySelector(`#${openedPostId}`);
				postElement && postElement.scrollIntoView(true);
			} catch (err) {}
		},
		setShowCommentInput (item) {
			if (!item) {
				return false;
			}
			let comment;

			if (item.element.id.includes('group')) {
				comment = (this.$refs.component || []).find(c => c.$el.parentNode === item.element);
			} else {
				comment = (this.$refs.comments || []).find(c => c.$el.parentNode === item.element);
			}

			if (!comment) {
				return false;
			}

			const elHasInput = comment.$refs['post-comments'] || comment;

			if (elHasInput.showInput) {
				return false;
			}
			this.showCommentInputTimeout = setTimeout(() => {
				elHasInput.showInput = true;
			}, 4000);
			return true;
		},
	},
};
</script>

<style lang="stylus" scoped>
[id^="post_id_"]:not(:last-child)
	margin 0 0 7.50vw

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
.squadder-feed
	.feed
		margin-top 10px
		@media screen and (max-width: 280px)
			margin-top 5px
</style>
