<template>
	<Post
		:post="post"
	>
		<div class="wrapper mb-2">
			<div class="vote_slider_wrapper">
				<div
					ref="vote_slider"
					class="vote_slider"
					:class="{ first: post.voted === 1, second: post.voted === 2}"
					@touchstart="checkStartSliderTouch"
					@touchmove="checkFinalSliderTouch"
				>
					<span class="sqdi-arrow-point-to-right left" @click="() => vote(1)" />
					<span ref="vote_btn" class="vote">{{ post.voted ? $t('poll.voted') : $t('poll.vote') }}</span>
					<span class="sqdi-arrow-point-to-right right" @click="() => vote(2)" />
				</div>
			</div>
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
import { createNamespacedHelpers } from 'vuex';
import Post from './Includes/Post';
import PollItem from './Includes/PollItem';
import { FeedPost } from '~/classes/FeedPost';
import { PostStore, PostActions } from '~/store/post';
import { UserStore } from '~/store/user';

const { mapState } = createNamespacedHelpers(UserStore);

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
			startX: 0,
			isSliderDragged: false,
		};
	},
	computed: {
		...mapState([
			'me',
		]),
		isVoted () {
			return (this.post.user.guid === this.me.userId || !!this.post.voted || this.post.voted === 0);
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
		checkStartSliderTouch(event) {
			this.startX = parseInt(event.targetTouches[0].clientX);
		},
		checkFinalSliderTouch(e) {
			const MIN_DIFFERENT = 30;
			const lastX = e.touches[0].clientX;
			const different = lastX - this.startX;
			if (Math.abs(different) < MIN_DIFFERENT) {
				return false;
			}
			if (this.startX > lastX) {
				this.vote(1);
			} else {
				this.vote(2);
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
	bottom 21%
	border-radius 12px
	justify-content space-around

.vote_slider
	width 24%
	height 86%
	position: absolute;
	top 7%
	left 50%
	color white
	transform translateX(-50%)
	background-color black
	border-radius 10px
	transition 1s all
	.vote
		font-size .6em
		font-weight 700
		color inherit
		display flex
		justify-content center
		flex-direction column
		text-align center
		height 100%
		transition .5s all

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

.first,
.second
	background-color white
	color black
	border-radius 10px

.first
	left 25%

.second
	left 75%
</style>
