<template>
	<div class="wrapper mb-2">
		<div class="poll-post grid">
			<PollItem
				ref="poll-item1"
				:item="post.item1"
				:total="total"
				:voted="isVoted"
				:details="true"
			/>
			<PollItem
				ref="poll-item2"
				:item="post.item2"
				:total="total"
				:voted="isVoted"
				:details="true"
			/>
		</div>
		<div class="poll-post grid">
			<div class="pa-2">
				<Votes ref="votes1" :votes="post.item1.votes" />
				<template v-for="voter in post.item1.voters">
					<Voter :key="voter.id" :voter="voter" />
				</template>
			</div>
			<div class="pa-2">
				<Votes ref="votes2" :votes="post.item2.votes" />
				<template v-for="voter in post.item2.voters">
					<Voter :key="voter.id" :voter="voter" />
				</template>
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
.poll-post {
	grid-template-columns: 1fr 1fr;
	grid-gap: 3px;
}

.wrapper {
	position: relative;
}
</style>
