<template>
	<div v-if="isMyPost || !post.closed || post.voted" class="vote_slider_wrapper" :class="{ isMyPostSlider: isMyPost }">
		<Button v-if="isMyPost || post.closed" @click.native="toDetailsPage">
			{{ $t('poll.results') }}
		</Button>
		<button
			v-else
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
			<span class="sqdi-arrow-point-to-right left" />
			<span ref="vote_btn" class="vote">{{ post.voted ? $t('poll.voted') : $t('poll.vote') }}</span>
			<span class="sqdi-arrow-point-to-right right" />
		</button>
		<span v-if="post.voted && post.closed && !isMyPost" class="voted-selection" :class="{ left_select: post.voted === 1, right_select: post.voted === 2 }" />
	</div>
</template>

<script>
import { FeedPost } from '~/classes/FeedPost';
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
	data: () => ({
		startX: 0,
		lastX: 0,
		isMouseDown: false,
	}),
	computed: {
		isMyPost () {
			return (this.post.byMe || this.post.voted === 0);
		},
	},
	methods: {
		checkStartSliderTouch(e, movedBy = 'touch') {
			if (movedBy === 'touch') {
				this.startX = parseInt(e.targetTouches[0].clientX);
			} else {
				this.startX = e.screenX;
				this.isMouseDown = true;
			}
			this.lastX = movedBy === 'touch' ? e.targetTouches[0].clientX : e.clientX;
		},
		moveSlider(e, movedBy = 'touch') {
			if (this.voted) {
				return false;
			}
			let x;
			if (movedBy === 'touch') {
				if (this.isOnSliderBorder(movedBy, e.targetTouches[0].clientX)) {
					return false;
				}
				x = e.targetTouches[0].clientX;
			} else {
				if (!this.isMouseDown || this.isOnSliderBorder(movedBy, e.clientX)) {
					return false;
				}
				x = e.clientX;
			}
			this.$refs.vote_slider.style.left = `${x}px`;
			this.lastX = movedBy === 'touch' ? e.targetTouches[0].clientX : e.clientX;
		},
		setSliderPosition(movedBy = 'touch') {
			if (movedBy === 'mouse') {
				this.isMouseDown = false;
			}
			const MIN_DIFFERENT = 50;
			const halfScreenWidth = document.body.clientWidth / 2;
			const different = this.lastX - halfScreenWidth;
			if (Math.abs(different) < MIN_DIFFERENT) {
				this.$refs.vote_slider.style.left = '50%';
				return false;
			}
			const choosedPictureNumber = different < 0 ? 1 : 2;
			const DELAY_FOR_ANIMATION = 100;
			setTimeout(() => {
				this.$refs.vote_slider.style.left = '';
				this.$emit('vote', choosedPictureNumber);
			}, DELAY_FOR_ANIMATION);
		},
		isOnSliderBorder(movedBy, x) {
			const screenWidth = window.innerWidth;
			const BORDER_DISTANCE = (screenWidth / 100) * 20;
			const leftSlideBorder = BORDER_DISTANCE;
			const rightSlideBorder = screenWidth - (BORDER_DISTANCE * 1.5);
			if (x <= leftSlideBorder || x >= rightSlideBorder) {
				return true;
			}
		},
		toDetailsPage() {
			if (this.post.type !== 'pollPost') {
				return;
			}
			this.$router.push(`/poll/${this.post.postId}`);
		},
	},
};
</script>

<style lang="stylus" scoped>
.vote_slider_wrapper
	display flex
	position absolute
	width 98%
	left 1%
	height 41px
	padding 3px 0
	background-color rgba(0, 0, 0, .12)
	top 55%
	border-radius 12px
	justify-content space-around
	z-index 5
	&.isMyPostSlider
		background-color transparent
	span.voted-selection
		width 9.23vw
		height 9.23vw
		background-color #fff
		position absolute
		border-radius 50%
		background-size 2.9vw
		background-position: center;
		background-image url('~assets/img/checked.svg')
		&.left_select
			left 10px
		&.right_select
			right 10px
.poll_expired
	.vote_slider_wrapper
		background-color transparent
.vote_slider
	width 23.076vw
	height 9.384vw
	position: absolute;
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
		transition .2s all
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
	.sqdi-arrow-point-to-right
		display none
	.vote
		padding-left 15px
		background-size 2.9vw
		background-position 18% 45%
		background-image url('~assets/img/checked.svg')
button.first
	left 25%

button.second
	left 75%
</style>
