<template>
	<div class="poll-item">
		<ProductCard
			ref="product-card"
			:item="item"
		/>
		<div
			v-if="voted"
			class="poll-item__votes"
		>
			<span
				ref="poll-item-votes-count"
				class="poll-item__votes-count"
			>
				{{ votes }} %
			</span>
		</div>
	</div>
</template>

<script>
import ProductCard from './ProductCard';
import { isInteger } from '~/utils/number';

export default {
	name: 'PollItem',
	components: {
		ProductCard,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		voted: {
			type: Boolean,
			default: false,
		},
		oppositeVotes: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		votes () {
			const votesPercentage = this.item.votes
				? this.item.votes / (this.item.votes + this.oppositeVotes) * 100
				: 0;

			return this.formatVotes(votesPercentage);
		},
	},
	methods: {
		formatVotes (value) {
			return value && isInteger(value)
				? value
				: !isInteger(value)
					? value.toFixed(2)
					: 0;
		},
	},
};
</script>

<style lang="stylus" scoped>
.poll-item
	position relative
	&__votes
		display flex
		align-items center
		justify-content center
		position absolute
		left 0
		top 0
		bottom 0
		right 0
		background-color rgba(0, 0, 0, .5)
		text-align center
		z-index 1
		&-count
			color #fff
			font-size 32px
</style>
