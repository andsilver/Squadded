<template>
	<div class="px-2">
		<div ref="top-items-title" class="d-flex align-center mb-3">
			<img class="ml-1" :width="16" src="~assets/img/trending-icon.png" alt="">
			<h3 class="ml-3">
				{{ $t('explore_page.top_items.title') }}
			</h3>
		</div>
		<div v-if="items && items.length" class="overflow-x-auto d-flex">
			<div v-for="(post, index) of items" :key="index" @click="openProduct(post)">
				<div ref="post-card" class="post-card">
					<CardFrame
						ref="card-frame"
						:price="price(post)"
						:origin-price="originPrice(post)"
						:title="post.item.title"
						:item="post.item"
						show-bag
						:show-refresh="false"
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
.post-card
	white-space nowrap
	width 250px
	margin-right 12px
	position relative
	>>> .card_bottom.card_inline
		padding 16px 12px
		position: absolute;
		bottom: 0px;
		width: 100%;
		z-index 10
		*
			color white !important
		.buy_button
			top 25%
			right 8px
		.post_price
			font-weight bold
			font-size 16px
		.post_title
			font-size 16px
	.opacity-overlay
		background: linear-gradient(rgba(0, 0, 0, 0.025) 50%, rgba(0, 0, 0, 0.5) 100%);
		position absolute
		width 100%
		height 100%
		top 0
		z-index 9
</style>
