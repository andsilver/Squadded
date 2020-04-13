<template>
	<div class="px-0">
		<div ref="top-items-title" class="d-flex align-center ma-3 ml-2 mt-0">
			<img class="ml-1" :width="18.5" src="~assets/img/trending-icon.png" alt="">
			<h3 class="ml-3">
				{{ $t('explore_page.top_items.title') }}
			</h3>
		</div>
		<div v-if="items && items.length" class="overflow-x-auto d-flex">
			<div v-for="(post, index) of items" :key="index" class="count_sec top-items" :style="{ 'z-index': 100 - index }" @click="openProduct(post)">
				<div ref="post-card" class="post-card">
					<span class="count_item">{{ index + 1 }}</span>
					<CardFrame
						ref="card-frame"
						:price="price(post)"
						:origin-price="originPrice(post)"
						:title="post.item.title"
						:item="post.item"
						show-bag
						:show-refresh="true"
						:light-refresh="true"
						:post-id="post.guid"
						:post="post"
					>
						<ItemImage
							ref="item-image"
							:item="post.item"
						/>
					</CardFrame>
					<div class="opacity-overlay" />
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
import CardFrame from '~/components/Posts/Includes/CardFrame';
import ItemImage from '~/components/Posts/Includes/ItemImage';
import { price } from '~/helpers';
import { SquadAPI } from '~/services/SquadAPI';

export default {
	components: {
		ItemImage,
		CardFrame,
	},
	computed: {
		items () {
			return this.$store.getters[`${ExploreStore}/${ExploreGetters.getItems}`]('topItems');
		},
	},
	created() {
		this.$store.dispatch(`${ExploreStore}/${ExploreActions.fetchItems}`, 'topItems');
	},
	methods: {
		price (post) {
			return price(post.item.currency, post.item.price, this._i18n.locale);
		},
		originPrice (post) {
			if (post.item.origPrice) {
				return price(post.item.currency, post.item.origPrice, this._i18n.locale);
			} else {
				return '';
			}
		},
		openProduct (post) {
			SquadAPI.openProduct(post.item);
		},
	},
};
</script>

<style lang="stylus" scoped>
.w-78
	width 62.906vw
	margin-right 3.07vw !important
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
.post-card
	white-space nowrap
	width 230px
	position relative
	padding 0px 20px
	margin-right 20px
	.card_frame
		box-shadow rgba(0,0,0,0.4) 3.07vw 3.07vw 6.23vw
	>>> .card_bottom.card_inline
		padding 16px 12px
		position: absolute;
		bottom: 0px;
		width: 100%;
		z-index 10
		display flex
		flex-direction column
		*
			color white !important
			line-height 4.4vw
		.buy_button
			top auto
			display none
			bottom 2.10vw
			right 2.35vw
			width 8.15vw
			height 8.15vw
			border-radius 50%
			background-color rgba(0,0,0,0.3)
			&:before
				font-size 3.2vw
				left auto
				width 8.15vw
				top 50%
				transform translateY(-50%)
		.refresh-icon
			top auto
			bottom 2.4vw
			right 2.31vw
			width 8.15vw
			height 8.15vw
			border-radius 50%
			background-color rgba(0,0,0,0.3)
			display flex
			justify-content center
			.refresh-count
				display none
		.post_price
			font-weight bold
			font-size 16px
			order 2
		.post_title
			font-size 16px
	.opacity-overlay
		background: linear-gradient(rgba(0, 0, 0, 0.000) 50%, rgba(0, 0, 0, 0.5) 100%);
		position absolute
		width 83%
		height 83%
		bottom 0
		z-index 9
	.count_item
		color #ffffff
		font-size 38.46vw
		font-weight 700
		-webkit-text-stroke-width 2px
		-webkit-text-stroke-color #FD6256
		position absolute
		z-index 1
		line-height 28.46vw
		top 0
		left -50px
.overflow-x-auto
	overflow hidden
	padding 10px 0 35px
	.count_sec:first-child
		margin-left 20px
		.count_item
			left -9px
</style>
