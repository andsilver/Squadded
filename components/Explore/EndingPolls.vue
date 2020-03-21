<template>
	<div class="px-0">
		<div ref="top-items-title" class="d-flex align-center ma-3 ml-2 mt-0">
			<img class="ml-1" :width="20.5" src="~assets/img/ending-poll-watch.svg" alt="">
			<h3 ref="ending-polls-title" class="ml-3">
				{{ $t('explore_page.ending_polls.title') }}
			</h3>
		</div>
		<div v-if="items && items.length" class="overflow-x-auto d-flex poll-explore">
			<div v-for="(post, index) of items" :key="index" @click="goToLandingPost(post)">
				<div class="wrapper mb-2" :class="{ my_post_wrapper: isMyPost(post) }">
					<div class="end_timer d-flex align-center">
						<img class="ml-1" :width="18" src="~assets/img/end_time.svg" alt="">
						<Countdown :time-stamp="post.expires" />
					</div>
					<VoteSlider :post="post" />
					<div class="poll-post ending-poll-post poll-post-explore grid">
						<PollItem
							ref="poll-item1"
							:item="post.item1"
							:post-id="post.guid"
							:total="total(post)"
							:is-closed="false"
							:voted="false"
						/>
						<PollItem
							ref="poll-item2"
							:item="post.item2"
							:post-id="post.guid"
							:total="total(post)"
							:is-closed="false"
							:voted="false"
						/>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="!items || !items.length">
			<span ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
		</div>
	</div>
</template>

<script>
import { ExploreStore, ExploreGetters, ExploreActions } from '~/store/explore';
import Countdown from '~/components/common/Countdown';
import PollItem from '~/components/Posts/Includes/PollItem';
import VoteSlider from '~/components/Posts/Includes/VoteSlider';
import { PostStore, PostActions } from '~/store/post';
import { SquadAPI } from '~/services/SquadAPI';

export default {
	components: {
		Countdown,
		PollItem,
		VoteSlider,
	},
	computed: {
		items () {
			if (this.$store.getters[`${ExploreStore}/${ExploreGetters.getItems}`]('endingPolls')) {
				return this.$store.getters[`${ExploreStore}/${ExploreGetters.getItems}`]('endingPolls').filter(n => n.expires);
			} else {
				return this.$store.getters[`${ExploreStore}/${ExploreGetters.getItems}`]('endingPolls');
			}
		},
	},
	created() {
		this.$store.dispatch(`${ExploreStore}/${ExploreActions.fetchItems}`, 'endingPolls');
	},
	methods: {
		isMyPost (post) {
			return (post.byMe || post.voted === 0);
		},
		total (post) {
			return post.item1.votes + post.item2.votes;
		},
		vote (post, vote) {
			if (!this.isVoted(post)) {
				this.$store.dispatch(`${PostStore}/${PostActions.vote}`, { post, vote });
			} else if (post.closed) {
				if (vote === 1) {
					SquadAPI.openProduct(post.item1);
				} else {
					SquadAPI.openProduct(post.item2);
				}
			}
		},
		goToLandingPost(post) {
			this.$router.push(`/post/${post.postId}`);
		},
	},
};
</script>

<style lang="stylus" scoped>
.px-0
	&:after
		content ''
		border-bottom 1px solid #dbdbdb
		padding-bottom 0
		position absolute
		width 90%
		left 50%
		transform translateX(-50%)
	h3
		font-size 4.92vw
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
	width 78vw
	margin-right 3.07vw !important
	>>> .is_poll .v-image
		height 250px
.full_post
	margin-bottom 6.15vw
	position relative
.end_timer
	justify-content center
	background #000000
	color #fff
	font-size 3.46vw
	font-weight 700
	padding 3.46vw 0px
	margin-bottom 0.75vw
.overflow-x-auto
	div:first-child
		margin-left 4px
</style>
