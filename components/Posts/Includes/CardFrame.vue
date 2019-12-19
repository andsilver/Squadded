<template>
	<v-card
		class="card_frame"
		:class="{ is_poll: isPollPost }"
		:loading="loading"
	>
		<slot />
		<div v-if="showTap" class="tap-photo">
			{{ $t('tip.tapPhotos') }}
		</div>
		<section class="card_bottom" :class="{ card_inline: title }">
			<v-card-text
				ref="item-price"
				class="post_price"
				@click="() => $emit('open')"
			>
				<span v-if="originPrice" class="original-price">{{ originPrice }}</span>
				<span :class="{ discount_price: originPrice }">{{ price }}</span>
				<span v-if="showTap" class="for-all">{{ $t('forAllItems', {'0': postLength}) }}</span>
			</v-card-text>
			<v-card-title
				v-if="title"
				ref="item-title"
				class="post_title"
				@click="() => $emit('open')"
			>
				<span>{{ title }}</span>
			</v-card-title>
			<div v-if="showRefresh" class="refresh-icon">
				<img src="~assets/img/refresh.svg" class="refresh-logo">
				<span class="refresh-count">{{ short(item.outfits) }}</span>
			</div>
			<button
				v-if="showBag"
				ref="buy-button"
				class="buy_button sqdi-shopping-bag-2"
				:class="{ bag_inline: title }"
			/>
		</section>
	</v-card>
</template>

<script>
import { shortNumber } from '~/helpers';

export default {
	name: 'CardFrame',
	props: {
		price: {
			type: [Number, String],
			default: '',
		},
		originPrice: {
			type: [Number, String],
			default: '',
		},
		title: {
			type: [Number, String],
			default: '',
		},
		isPollPost: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		showBag: {
			type: Boolean,
			default: true,
		},
		showTap: {
			type: Boolean,
			default: false,
		},
		postLength: {
			type: Number,
			default: 0,
		},
		showRefresh: {
			type: Boolean,
			default: false,
		},
		item: {
			type: Object,
			required: false,
			default: () => {},
		},
	},
	methods: {
		short(number) {
			if (number) {
				return shortNumber(number, this._i18n.locale);
			} else {
				return '0';
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.compare-two
	.card_frame
		&.is_poll
			margin-bottom 15px
.card_frame
	border-radius 0 !important
	box-shadow rgba(0, 0, 0, 0.1) 0px 0.92vw 6.153vw

	.card_bottom
		margin-top 2%
		&.card_inline
			position relative
	.post_price
		padding 0
		span
			font-size 1em
			font-weight 700
			&.for-all
				font-size 3.230vw
				font-weight 500
				color #B8B8BA
				background #F4F4F5
				padding 0 2.153vw
				border-radius 0.76vw
				margin-left 1px
			&.discount_price
				color #FD6256
			&.original-price
				margin-right 0.3vw
				text-decoration line-through
				font-weight 400

	.post_title
		margin-top 1%
		padding 0
		width 100%
		span
			min-height 12px
			max-height 8.615vw
			word-break normal
			overflow hidden
			font-size 3.076vw
			line-height 4vw
			font-weight 500
			color #B8B8BA

	.buy_button
		width 30px
		height 30px
		position absolute
		right 4%
		bottom 4%
		&.bag_inline
			top 8%
			bottom auto

	.sqdi-shopping-bag-2:before
		width 30px
		position absolute
		font-size 1.3em
		left auto
		right 0
		top 10%

	&.is_poll
		box-shadow none
		.card_bottom
			padding-top 0
			margin-top 4%
		.post_title
			width 80%
	.tap-photo
		font-size 3.3846vw
		text-align center
		margin-top 3vw
		margin-bottom 3vw
		color #B8B8BA
		font-weight 500
	.refresh-icon
		position absolute
		top 18%
		right 27%
		.refresh-logo
			width: 4.92VW;
		.refresh-count
			border-radius 1.846vw
			font-size 2.461vw
			font-weight 500
			width 4.923vw
			height 3.7vw
			background #B8B8BA
			display inline-block
			text-align center
			color #fff
			position absolute
			bottom 5.307vw
			left 3.307vw
			line-height: 3.7vw
&.single-item
	.buy_button
		&.bag_inline
			top 1%
			bottom auto
			right 0px
			text-align right
			width 25px
	.sqdi-shopping-bag-2:before
		top: 0
	.refresh-icon
		right 20%
		top 9%
	.card_bottom
		margin-top 5%
</style>
