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
		<div v-for="(post, n) in aggregatedItems" :key="n">
			<component :is="getComponent(post)" :is-paired="paired" :post="post" />
			<Comments
				v-if="showComments(post)"
				:post="post"
				:show-all="false"
				:for-feed="true"
			/>
		</div>
	</section>
</template>

<script>
import GalleryPost from '~/components/Posts/GalleryPost';
import MultiItemPost from '~/components/Posts/MultiItemPost';
import SingleItemPost from '~/components/Posts/SingleItemPost';
import PollPost from '~/components/Posts/PollPost';
import GroupedPosts from '~/components/Posts/GroupedPosts';
import Comments from '~/components/Comments';

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
	width 130px
	height 30px !important
	position absolute
	top 20px
	left calc(50% - 50px)
	z-index 9
	text-transform none
</style>
