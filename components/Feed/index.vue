<template lang="html">
	<section class="feed">
		<span v-if="!items.length">{{ $t('feed.isEmpty') }}</span>
		<v-list v-else three-line>
			<feed-post
				v-for="post in items"
				:key="post.correlationId || post.guid"
				:post="post"
			/>
		</v-list>
	</section>
</template>

<script lang="js">
import FeedPost from './Post';

export default {
	name: 'Feed',
	components: {
		'feed-post': FeedPost,
	},
	props: {
		items: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
		};
	},
	computed: {

	},
	mounted() {

	},
	methods: {

	},
};
</script>

<style scoped lang="scss">
	.feed {

	}
</style>
