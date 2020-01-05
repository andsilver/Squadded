<template>
	<section class="feed">
		<template v-for="(post, n) in aggregatedItems">
			<component :is="getComponent(post)" :key="n" :post="post" />
		</template>
	</section>
</template>

<script>
import GalleryPost from '~/components/Posts/GalleryPost';
import MultiItemPost from '~/components/Posts/MultiItemPost';
import SingleItemPost from '~/components/Posts/SingleItemPost';
import PollPost from '~/components/Posts/PollPost';
import GroupedPosts from '~/components/Posts/GroupedPosts';

const MINUTES = 2; // 2 minutes

export default {
	name: 'Feed',
	components: {
		SingleItemPost,
		GroupedPosts,
		PollPost,
		MultiItemPost,
		GalleryPost,
	},
	props: {
		items: {
			type: Array,
			default() {
				return [];
			},
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
	methods: {
		getComponent(post) {
			return this.components[post.type];
		},
	},
};
</script>

<style lang="stylus" scoped>
.feed {
	width: 100%;
}
</style>
