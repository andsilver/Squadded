<template>
	<Post
		:post="post"
	>
		<div class="wrapper mb-2">
			<div v-if="!isMyPost" class="vote_slider_wrapper">
				<button
					ref="vote_slider"
					class="vote_slider"
					:class="{ first: post.voted === 1, second: post.voted === 2 }"
					@touchstart="(e) => checkStartSliderTouch(e, 'touch')"
					@touchmove="(e) => moveSlider(e, 'touch')"
					@touchend="setSliderPosition('touch')"
					@mousedown="(e) => checkStartSliderTouch(e, 'mouse')"
					@mousemove="(e) => moveSlider(e, 'mouse')"
					@mouseup="setSliderPosition('mouse')"
				>
					<span class="sqdi-arrow-point-to-right left" @click="() => vote(1)" />
					<span ref="vote_btn" class="vote">{{ post.voted ? $t('poll.voted') : $t('poll.vote') }}</span>
					<span class="sqdi-arrow-point-to-right right" @click="() => vote(2)" />
				</button>
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
import Post from './Includes/Post';
import PollItem from './Includes/PollItem';
import { FeedPost } from '~/classes/FeedPost';
import { PostStore, PostActions } from '~/store/post';

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
			lastX: 0,
			isMouseDown: false,
			isDragged: false,
		};
	},
	computed: {
		isMyPost () {
			return (this.post.byMe || this.post.voted === 0);
		},
		isVoted () {
			return (this.isMyPost || !!this.post.voted);
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
		checkStartSliderTouch(e, movedBy = 'touch') {
			if (movedBy === 'touch') {
				this.startX = parseInt(e.targetTouches[0].clientX);
			} else {
				this.startX = e.screenX;
				this.isMouseDown = true;
			}
		},
		moveSlider(e, movedBy = 'touch') {
			if (this.isDragged) {
				return false;
			}
			if (movedBy === 'touch') {
				this.$refs.vote_slider.style.left = `${e.targetTouches[0].clientX}px`;
				this.lastX = e.targetTouches[0].clientX;
			} else {
				if (!this.isMouseDown) {
					return false;
				}
				this.$refs.vote_slider.style.left = `${e.clientX}px`;
				this.lastX = e.clientX;
			}
		},
		setSliderPosition(movedBy = 'touch') {
			if (movedBy === 'mouse') {
				this.isMouseDown = false;
			}
			const MIN_DIFFERENT = 50;
			const halfScreenWidth = document.body.clientWidth / 2;
			const different = this.lastX - halfScreenWidth;
			if (Math.abs(different) < MIN_DIFFERENT) {
				this.$refs.vote_slider.style.left = `50%`;
				return false;
			}
			const choosedPictureNumber = different < 0 ? 1 : 2;
			const DELAY_FOR_ANIMATION = 500;
			setTimeout(() => {
				this.isDragged = true;
				this.$refs.vote_slider.style.left = ``;
				this.vote(choosedPictureNumber);
			}, DELAY_FOR_ANIMATION);
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
	transition 1s color
	.vote
		font-size .6em
		font-weight 700
		color inherit
		display flex
		justify-content center
		flex-direction column
		text-align center
		width 100%
		height 100%
		transition .5s all
		user-select none

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
	transition all .5s

button.first
	left 25%

button.second
	left 75%
</style>
