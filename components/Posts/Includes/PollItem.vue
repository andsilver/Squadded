<template>
	<div class="poll-item">
		<CardFrame
			ref="product-card"
			:price="price"
			:origin-price="originPrice"
			:title="item.title"
			:voted="voted"
			:item="item"
			:show-bag="voted"
			:details="details"
			is-poll-post
		>
			<ItemImage
				:item="item"
				:resquadd="voted"
			>
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
					<span v-if="(votes > 50 && isClosed)" class="winner-text">
						{{ $t('winner') }}
					</span>
				</div>
			</ItemImage>
		</CardFrame>
	</div>
</template>

<script>
import CardFrame from './CardFrame';
import ItemImage from './ItemImage';
import { price } from '~/helpers';

export default {
	name: 'PollItem',
	components: {
		CardFrame,
		ItemImage,
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
		isClosed: {
			type: Boolean,
			default: false,
		},
		details: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		price () {
			return price(this.item.currency, this.item.price, this._i18n.locale);
		},
		originPrice () {
			if (this.item.origPrice) {
				return price(this.item.currency, this.item.origPrice, this._i18n.locale);
			} else {
				return '';
			}
		},
		votes () {
			return (this.total)
				? Math.round(this.item.votes / (this.total) * 100)
				: 0;
		},
	},
};
</script>

<style lang="stylus" scoped>
.poll-item__votes
	display flex
	align-items center
	justify-content center
	position absolute
	width 100%
	height 100%
	background-color rgba(0, 0, 0, .5)
	text-align center
	pointer-events none
	&-count
		color #fff
		font-size 6vw
		display flex
		align-items center
		justify-content center
		height 18.461vw
		width 18.461vw
		border 1px solid rgba(255,255,255, .5)
		border-radius 50%
		font-weight 600

	sup
		font-size 60%
		font-weight 600
		margin-left 1px
.choosed
	background-color rgba(0, 0, 0, .40)
	.poll-item__votes-count
		color #000
		background #ffffff
		border-color #fff
.notchoosed
	background-color rgba(255, 255, 255, .40)
.poll_ongoing
	.my_post_wrapper
		.choosed,
		.notchoosed
			background-color transparent
			.poll-item__votes-count
				display none
.winner-text
	position absolute
	top 68%
	color #fff
	font-weight 600
	text-transform uppercase
	font-size 2.8vw
	letter-spacing 1px

.poll_expired
	.choosed
		.poll-item__votes-count
			color #ffffff
			background #FD6256
			border-color #FD6256
</style>
