<template>
	<div class="px-2">
		<div ref="ending-polls-title">
			<div class="d-flex align-center">
				<v-icon color="black">
					mdi-timer
				</v-icon>
				<h3 class="ml-2">
					{{ $t('explore_page.ending_polls.title') }}
				</h3>
			</div>
			<p class="ml-8">
				{{ $t('explore_page.ending_polls.description') }}
			</p>
		</div>
		<div v-if="items && items.length" class="overflow-x-auto d-flex">
			<div v-for="(post, index) of items" :key="index" @click="goToLandingPost(post)">
				<div class="wrapper mb-2" :class="{ my_post_wrapper: isMyPost(post) }">
					<VoteSlider :post="post" style="pointer-events: none" />
					<div class="poll-post grid">
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
import PollItem from '~/components/Posts/Includes/PollItem';
import VoteSlider from '~/components/Posts/Includes/VoteSlider';
import { PostStore, PostActions } from '~/store/post';
import { SquadAPI } from '~/services/SquadAPI';

export default {
	components: {
		PollItem,
		VoteSlider,
	},
	computed: {
		items () {
			return this.$store.getters[`${ExploreStore}/${ExploreGetters.getItems}`]('endingPolls');
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
			this.$router.push('/post/5e1f1c666f8a8d5384454d7a');
		},
	},
};
</script>

<style lang="stylus" scoped>
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
		height 182px
.full_post
	margin-bottom 6.15vw
	position relative
</style>
