<template>
	<div
		class="vote-button-container"
		:style="{
			transform: translateX
		}"
	>
		<div class="d-flex vote-button">
			<v-btn
				class="vote-button-first d-flex align-center"
				:style="{
					background: first.background,
					width: first.width + 'px',
				}"
				@click="voteOnFirst"
			>
				<div v-if="notVoted" class="d-flex align-center not-voted">
					<span class="mx-2" style="font-size: 18px">‹</span>
					<span class="mr-4" style="margin-top: 1px">{{ $t('this') }}</span>
				</div>
				<div v-else-if="first.percent > 10">
					<div style="font-size: 8px">
						{{ $t('this') }}
					</div>
					<div>
						{{ first.percent }}%
					</div>
				</div>
			</v-btn>
			<v-btn
				class="vote-button-second d-flex align-center"
				:style="{
					background: second.background,
					width: second.width + 'px',
				}"
				@click="voteOnSecond"
			>
				<div v-if="notVoted" class="d-flex align-center not-voted">
					<span class="ml-4" style="margin-top: 1px">{{ $t('that') }}</span>
					<span class="mx-2" style="font-size: 18px">›</span>
				</div>
				<div v-else-if="second.percent > 10">
					<div style="font-size: 8px">
						{{ $t('that') }}
					</div>
					<div>
						{{ second.percent }}%
					</div>
				</div>
			</v-btn>
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
		translateX() {
			return `translateX(calc(50% + ${21.5 + (this.second.width - this.first.width) / 2}px))`;
		},
	},
	methods: {
		buttonColor(first) {
			if (this.notVoted) {
				return '#fff';
			}
			const diff = this.post.item1.votes - this.post.item2.votes;
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
				return 70;
			}
			const length = 120;
			const total = this.post.item1.votes + this.post.item2.votes;
			return 10 + Math.round((length / total) * (first ? this.post.item1.votes : this.post.item2.votes));
		},
		percent(first) {
			const total = this.post.item1.votes + this.post.item2.votes;
			return Math.round((100 * (first ? this.post.item1.votes : this.post.item2.votes)) / total);
		},
		voteOnFirst() {
			if (this.meVoted) {
				return this.toDetailsPage();
			}
			this.$emit('vote', 1);
		},
		voteOnSecond() {
			if (this.meVoted) {
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
	z-index: 2;
	transition: transform linear .25s;
}
.vote-button {
	height: 40px;
	text-transform: uppercase;
	color: black;
	position: relative;
	font-size: 12px;
	cursor: pointer;

	&-first,
	&-second {
		border-radius: 4px;
		height: 100%;
		padding: 0 !important;
		min-width: unset !important;
		transition: width linear 0.25s;
		font-size: 12px;
		font-weight: 700;
	}

	&-first {
		border-top-left-radius: 12px;
		border-bottom-left-radius: 12px;
		margin-right: 1px;
	}

	&-second {
		margin-left: 2px;
		border-top-right-radius: 12px;
		border-bottom-right-radius: 12px;
	}
}
</style>
