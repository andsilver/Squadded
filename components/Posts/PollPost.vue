<template>
	<Post
		:post="post"
	>
		<div class="wrapper mb-2">
			<VoteSlider :post="post" @vote="vote" />
			<div class="poll-post grid">
				<PollItem
					ref="poll-item1"
					:item="post.item1"
					:total="total"
					:voted="isVoted"
					@click.native="() => vote(1)"
				/>
				<PollItem
					ref="poll-item2"
					:item="post.item2"
					:total="total"
					:voted="isVoted"
					@click.native="() => vote(2)"
				/>
			</div>
		</div>
	</Post>
</template>

<script>
import Post from './Includes/Post';
import PollItem from './Includes/PollItem';
import VoteSlider from './Includes/VoteSlider';
import { FeedPost } from '~/classes/FeedPost';
import { PostStore, PostActions } from '~/store/post';

export default {
	name: 'PollPost',
	components: {
		Post,
		PollItem,
		VoteSlider,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
	computed: {
		isMyPost () {
			return (this.post.byMe || this.post.voted === 0);
		},
		isVoted () {
			return (this.post.closed || this.isMyPost || !!this.post.voted);
		},
		total () {
			return this.post.item1.votes + this.post.item2.votes;
		},
	},
	methods: {
		vote (vote) {
			if (!this.isVoted) {
				const { post } = this;
				this.$store.dispatch(`${PostStore}/${PostActions.vote}`, { post, vote });
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.poll-post
	grid-template-columns 1fr 1fr
	grid-gap 3px

.wrapper
	position relative
</style>
