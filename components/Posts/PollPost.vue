<template>
	<Post
		:post="post"
		:class="post.closed ? 'poll_expired': 'poll_ongoing'"
	>
		<div v-if="post.closed" class="is_poll_expired">
			{{ $t('expired') }}
		</div>
		<div class="wrapper mb-2" :class="{ my_post_wrapper: isMyPost }">
			<VoteSlider :post="post" @vote="vote" />
			<div class="poll-post grid">
				<PollItem
					ref="poll-item1"
					:item="post.item1"
					:total="total"
					:is-closed="post.closed"
					:voted="isVoted"
					@click.native="() => vote(1)"
				/>
				<PollItem
					ref="poll-item2"
					:item="post.item2"
					:total="total"
					:is-closed="post.closed"
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
import { SquadAPI } from '~/services/SquadAPI';

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
			} else {
				const { post } = this;
				if (post.closed) {
					if (vote === 1) {
						SquadAPI.openProduct(post.item1);
					} else {
						SquadAPI.openProduct(post.item2);
					}
				}
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.is_poll_expired
	text-align center
	background-color #DBDBDB
	line-height 9.23vw
	margin 0.61vw 0
	font-size 2.6vw
	font-weight 700
	text-transform uppercase
	letter-spacing 1px
	width 100%
.poll-post
	grid-template-columns 1fr 1fr
	grid-gap 3px
.wrapper
	position relative
</style>
