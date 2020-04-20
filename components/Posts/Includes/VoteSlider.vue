<template>
	<div
		class="vote-button-container"
	>
		<div class="d-flex vote-button justify-center">
			<div class="d-flex justify-end">
				<v-btn
					class="vote-button-first d-flex align-center"
					:style="{
						background: first.background,
						width: first.width + 'vw',
						color: first.background === 'black' ? 'white' : 'black'
					}"
					@click="voteOnFirst"
				>
					<div v-if="notVoted" class="d-flex align-center not-voted">
						<span class="mx-2" style="font-size: 18px">‹</span>
						<span class="mr-4" style="margin-top: 1px">{{ $t('this') }}</span>
					</div>
					<div v-else-if="first.percent > 10">
						<div class="d-flex align-center voted-text">
							<span>{{ $t('this') }}</span>
							<v-icon v-if="first.background === 'black'" x-small class="ml-1">
								mdi-check-circle
							</v-icon>
						</div>
						<div class="poll-percent">
							{{ first.percent }}%
						</div>
					</div>
				</v-btn>
			</div>
			<div class="d-flex">
				<v-btn
					class="vote-button-second d-flex align-center"
					:style="{
						background: second.background,
						width: second.width + 'vw',
						color: second.background === 'black' ? 'white' : 'black'
					}"
					@click="voteOnSecond"
				>
					<div v-if="notVoted" class="d-flex align-center not-voted">
						<span class="ml-4" style="margin-top: 1px">{{ $t('that') }}</span>
						<span class="mx-2" style="font-size: 18px">›</span>
					</div>
					<div v-else-if="second.percent > 10">
						<div class="d-flex align-center voted-text">
							<span>{{ $t('that') }}</span>
							<v-icon v-if="second.background === 'black'" x-small class="ml-1">
								mdi-check-circle
							</v-icon>
						</div>
						<div class="poll-percent">
							{{ second.percent }}%
						</div>
					</div>
				</v-btn>
			</div>
		</div>
	</div>
</template>

<script>
import { FeedPost } from '~/classes/FeedPost';

export default {
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
		meVoted() {
			return this.post.byMe || this.post.voted;
		},
		notVoted() {
			return this.post.item1.votes === 0 && this.post.item2.votes === 0;
		},
		first() {
			return {
				background: this.buttonColor(true),
				width: this.buttonWidth(true),
				percent: this.percent(true),
			};
		},
		second() {
			return {
				background: this.buttonColor(false),
				width: this.buttonWidth(false),
				percent: this.percent(false),
			};
		},
	},
	methods: {
		buttonColor(first) {
			if (this.notVoted) {
				return '#fff';
			}
			const diff = this.post.item1.votes - this.post.item2.votes;
			if (this.post.closed) {
				if ((diff > 0 && first) || (diff < 0 && !first)) {
					return 'black';
				}
			}
			if (diff === 0) {
				return first ? '#fff' : '#ddd';
			} else if (diff > 0) {
				return first ? '#ddd' : '#fff';
			} else {
				return first ? '#fff' : '#ddd';
			}
		},
		buttonWidth(first) {
			if (this.notVoted) {
				return 21.8;
			}
			const length = 33.6;
			const total = this.post.item1.votes + this.post.item2.votes;
			return 5 + Math.round((length / total) * (first ? this.post.item1.votes : this.post.item2.votes));
		},
		percent(first) {
			const total = this.post.item1.votes + this.post.item2.votes;
			return Math.round((100 * (first ? this.post.item1.votes : this.post.item2.votes)) / total);
		},
		voteOnFirst() {
			if (this.meVoted || this.post.closed) {
				return this.toDetailsPage();
			}
			this.$emit('vote', 1);
		},
		voteOnSecond() {
			if (this.meVoted || this.post.closed) {
				return this.toDetailsPage();
			}
			this.$emit('vote', 2);
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
<style lang="scss" scoped>
.vote-button-container {
	position: absolute;
	top: 55%;
	width: 100%;
	z-index: 2;
	transition: transform linear .25s;
}
.not-voted {
    font-size: 3.07vw;
	font-weight: 700;
}
.voted-text {
	font-size: 2.46vw;
	font-weight: 600;
}
.poll-percent {
    font-weight: 600;
    font-size: 3.53vw;
	text-align: left;
}
.vote-button {
	text-transform: uppercase;
	color: black;
	position: relative;
	font-size: 12px;
	cursor: pointer;

	> div {
		width: 43vw;
		margin: 0 1px;
	}

	&-first,
	&-second {
		border-radius: 4px;
		height: 11vw !important;
		padding: 0 !important;
		min-width: unset !important;
		transition: width linear 0.25s;
		font-size: 4vw;
		font-weight: 700;
	}

	&-first {
		border-top-left-radius: 12px;
		border-bottom-left-radius: 12px;
		align-self: flex-end;
	}

	&-second {
		border-top-right-radius: 12px;
		border-bottom-right-radius: 12px;
	}
}
.explore-content .vote-button-container {
	top: 65%;
}
</style>
