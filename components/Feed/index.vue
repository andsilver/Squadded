<template lang="html">
	<section class="feed">
		<span v-if="!items.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
		<FeedPost
			v-for="post in items"
			:key="post.correlationId || post.guid"
			:post="post"
		/>
	</section>
</template>

<script lang="js">
import FeedPost from './Post';

export default {
	name: 'Feed',
	components: {
		FeedPost,
	},
	props: {
		items: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>
