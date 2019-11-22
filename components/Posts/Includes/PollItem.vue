<template>
	<div class="poll-item">
		<ProductCard
			ref="product-card"
			:item="item"
			:voted="voted"
			is-poll-post
		/>
		<div
			v-if="voted"
			class="poll-item__votes"
			:class=" voted > 0 ? (votes > 50) ? 'choosed' : 'notchoosed' : '' "
		>
			<span
				ref="poll-item-votes-count"
				class="poll-item__votes-count"
			>
				{{ votes }}<sup>%</sup>
			</span>
		</div>
	</div>
</template>

<script>
import ProductCard from './ProductCard';

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
		total: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		votes () {
			return (this.total)
				? Math.round(this.item.votes / (this.total) * 100)
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
		bottom 20%
		right 0
		background-color rgba(0, 0, 0, .5)
		text-align center
		pointer-events none
		&-count
			color #fff
			font-size 26px
			display flex
			align-items center
			justify-content center
			height 70px
			width 70px
			border 1px solid rgba(255,255,255, .5)
			border-radius 50%
			font-weight 500

	sup
		font-size 16px
		font-weight 500
.choosed
	background-color rgba(253, 98, 86, .25)

.notchoosed
	background-color rgba(0,0,0, .20)
</style>
