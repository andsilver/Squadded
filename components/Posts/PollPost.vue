<template>
	<Post
		:post="post"
	>
		<div class="poll-post">
			<div class="poll-post__item">
				<PollItem
					ref="poll-item1"
					:item="post.item1"
				/>
			</div>
			<div class="poll-post__item">
				<PollItem
					ref="poll-item2"
					:item="post.item2"
				/>
			</div>
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
		display flex
		margin 12px -10px
		&__item
			width 50%
			padding-left 10px
			padding-right 10px
</style>
