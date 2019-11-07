<template>
	<Post
		:post="post"
	>
		<div class="wrapper mb-2">
			<div class="vote_slider_wrapper">
				<div class="vote_slider">
					<span class="sqdi-arrow-point-to-right left" />
					<span class="vote">{{ $t('poll.vote') }}</span>
					<span class="sqdi-arrow-point-to-right right" />
				</div>
			</div>
			<div class="poll-post grid">
				<PollItem
					ref="poll-item1"
					:item="post.item1"
					:opposite-votes="post.item2.votes"
					:voted="isVoted"
					@click.native="vote(post.item1)"
				/>
				<PollItem
					ref="poll-item2"
					:item="post.item2"
					:opposite-votes="post.item1.votes"
					:voted="isVoted"
					@click.native="vote(post.item2)"
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
	data() {
		return {
			isPollPost: true,
		};
	},
	computed: {
		isVoted () {
			return this.post.voted;
		},
	},
	methods: {
		vote (item) {
			if (!this.isVoted) {
				// TODO:: send vote request
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

.vote_slider_wrapper
	display flex
	position absolute
	width 98%
	left 1%
	height 40px
	z-index 5
	background-color rgba(0, 0, 0, .12)
	bottom 26%
	border-radius 12px
	justify-content space-around

.vote_slider
	width 24%
	height 86%
	position: absolute;
	top 7%
	background-color black
	border-radius 10px
	.vote
		font-size .6em
		font-weight 700
		color white
		display: flex;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		height 100%

.sqdi-arrow-point-to-right:before
	position absolute
	color white
	top 25%
	height 15px
	width 15px
	font-weight 700

.sqdi-arrow-point-to-right.left:before
	left 10%
	transform rotateZ(180deg) scale(.4)

.sqdi-arrow-point-to-right.right:before
	right 10%
	transform scale(.4)
</style>
