<template>
	<Post
		:post="post"
	>
		<div class="poll-post grid">
			<PollItem
				ref="poll-item1"
				:item="post.item1"
			/>
			<PollItem
				ref="poll-item2"
				:item="post.item2"
			/>
		</div>
	</Post>
</template>

<script>
import Post from './Includes/Post';
import PollItem from './Includes/PollItem';
import { FeedPost } from '~/classes/FeedPost';

export default {
	name: 'PollPost',
	components: {
		Post,
		PollItem,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
.poll-post
	grid-template-columns 1fr 1fr
	grid-gap 20px
</style>
