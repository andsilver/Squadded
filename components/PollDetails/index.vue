<template>
	<div class="wrapper poll-details">
		<div class="poll-post grid" :class="post.closed ? 'poll_expired': 'poll_ongoing'">
			<span v-if="post.closed" class="voted-selection" />
			<PollItem
				ref="poll-item1"
				:item="post.item1"
				:total="total"
				:is-closed="post.closed"
				:voted="true"
				:details="true"
			/>
			<PollItem
				ref="poll-item2"
				:item="post.item2"
				:total="total"
				:is-closed="post.closed"
				:voted="true"
				:details="true"
			/>
		</div>
		<div class="poll-post grid votes-wrapper">
			<div class="votes-section">
				<Votes ref="votes1" :votes="post.item1.votes" />
				<div class="voter-wrapper">
					<div class="voter-scroll">
						<template v-for="voter in post.item1.voters">
							<Voter :key="voter.id" :voter="voter" />
						</template>
					</div>
				</div>
			</div>
			<div class="votes-section left-border">
				<Votes ref="votes2" :votes="post.item2.votes" />
				<div class="voter-wrapper">
					<div class="voter-scroll">
						<template v-for="voter in post.item2.voters">
							<Voter :key="voter.id" :voter="voter" />
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import PollItem from '../Posts/Includes/PollItem';
import Votes from './Includes/Votes';
import Voter from './Includes/Voter';
import { FeedPost } from '~/classes/FeedPost';

export default {
	name: 'PollDetails',
	components: {
		PollItem,
		Votes,
		Voter,
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
		isVoted() {
			return this.post.closed || this.isMyPost || !!this.post.voted;
		},
		total() {
			return this.post.item1.votes + this.post.item2.votes;
		},
	},
};
</script>

<style lang="stylus" scoped>
.poll-post
	grid-template-columns 1fr 1fr
	grid-gap 3px
	position relative
	.votes-section
		padding 0
		&.left-border
			border-left 1px solid rgba(184,184,186,0.4)
			margin-left -2px
		.voter-wrapper
			padding-top 3.4vw
			position relative
			&::before
				background -moz-linear-gradient(top,  rgba(218,217,221,0.3) 0%, rgba(255,255,255,0) 100%)
				background -webkit-linear-gradient(top,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
				background linear-gradient(to bottom,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
				height 4.615vw
				width 100%
				content ''
				left 0
				position absolute
				top 0px
			.voter-scroll
				height calc(100vh - 482px)
				overflow-y auto
.votes-wrapper
	margin-left -12px
	margin-right -12px
	margin-bottom -12px
.wrapper
	position relative
span.voted-selection
	width 9.23vw
	height 9.23vw
	background-color #fff
	position absolute
	border-radius 50%
	background-size 2.9vw
	background-position: center;
	background-image url('~assets/img/checked.svg')
	z-index 1
	bottom 70px
	&.left_select
		left 10px
	&.right_select
		right 10px
</style>
