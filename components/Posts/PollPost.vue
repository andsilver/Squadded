<template>
	<Post
		:post="post"
		:hide-user="isPaired"
		:class="post.closed ? 'poll_expired': 'poll_ongoing'"
	>
		<!-- <div v-if="post.closed && !isPaired" class="is_poll_expired">
			For our record keep this comment to add any lable for poll expired
			{{ $t('expired') }}
		</div> -->
		<div class="wrapper mb-2" :class="{ my_post_wrapper: isMyPost }">
			<VoteSlider v-if="!isPaired" :post="post" @vote="vote" />
			<div class="poll-post grid">
				<PollItem
					ref="poll-item1"
					:item="post.item1"
					:post-id="post.guid"
					:total="total"
					:is-closed="post.closed"
					:voted="isVoted"
					:is-paired="isPaired"
					@click.native="() => vote(1)"
				/>
				<PollItem
					ref="poll-item2"
					:item="post.item2"
					:post-id="post.guid"
					:total="total"
					:is-closed="post.closed"
					:voted="isVoted"
					:is-paired="isPaired"
					@click.native="() => vote(2)"
				/>
				<span v-if="isPaired" class="poll-icon">
					<img src="~assets/img/poll-arrows.svg" class="poll-image">
				</span>
			</div>
		</div>
	</Post>
</template>

<script>
import Post from './Includes/Post';
import PollItem from './Includes/PollItem';
import VoteSlider from './Includes/VoteSlider';
import { OPENED_POST } from '~/consts/keys';
import { FeedPost } from '~/classes/FeedPost';
import { PostStore, PostActions } from '~/store/post';
import { SquadAPI } from '~/services/SquadAPI';
import { GA_ACTIONS } from '~/consts';

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
		isPaired: {
			type: Boolean,
			default: false,
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
			if (this.isPaired) {
				this.$root.$emit('postTaped', this.post.postId);
				return;
			}
			if (!this.isVoted) {
				const { post } = this;
				this.$store.dispatch(`${PostStore}/${PostActions.vote}`, { post, vote });
			} else {
				const { post } = this;
				sessionStorage.setItem(OPENED_POST, post.postId);
				SquadAPI.openProduct(vote === 1 ? post.item1 : post.item2);
				this.$gaAction(GA_ACTIONS.CLICK_ITEM);
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
	position relative
	span.poll-icon
		width 5.22vw
		height 5.22vw
		background-color #000
		border-radius 50%
		display flex
		justify-content center
		left 44%
		top 40.5%
		position absolute
		border 0.615vw solid #ffffff
		img.poll-image
			width 2.8vw
			margin-left 0.1vw
.wrapper
	position relative
.grid_gallery .wrapper
	display inline-block
	width 100%
</style>
