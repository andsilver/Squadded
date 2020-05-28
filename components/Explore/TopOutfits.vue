<template>
	<div class="px-0">
		<div ref="outfits-title">
			<div class="d-flex align-center ma-3 ml-2 mt-0">
				<v-icon color="black">
					mdi-heart-outline
				</v-icon>
				<h3 class="ml-2">
					{{ $t('explore_page.top_outfits.title') }}
				</h3>
			</div>
			<!--<p class="ml-8">
				{{ $t('explore_page.top_outfits.description') }}
			</p>-->
		</div>
		<div v-if="outfits && outfits.length" class="overflow-x-auto d-flex px-2 explore-outfit fancy_scroll">
			<div v-for="({ post }, index) of outfits" :key="index" class="grouped-post-item" @click="goToLandingPost(post)">
				<div ref="outfit-card" class="outfit-card">
					<p class="num_outfit">
						{{ post.items.length }} {{ $t('styleOutfit') }}
					</p>
					<CardFrame
						ref="multi-item"
						class="multi-item mb-4"
						:post-length="post.items.length"
						:post-id="post.guid"
						:price="totalPrice(post)"
					>
						<div class="grid" :class="`grid-snap-${post.items.length}`">
							<ItemImage
								v-for="item in post.items"
								ref="item-image"
								:key="item.itemId"
								:item="item"
								:resquadd="false"
							/>
						</div>
						<!-- <div class="title">
							{{ post.text }}
						</div> -->
					</CardFrame>
				</div>
			</div>
		</div>
		<div v-else-if="!outfits || !outfits.length" class="pa-2">
			<span ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
		</div>
	</div>
</template>

<script>
import { ExploreStore, ExploreGetters, ExploreActions } from '~/store/explore';
import CardFrame from '~/components/Posts/Includes/CardFrame';
import ItemImage from '~/components/Posts/Includes/ItemImage';
import { price } from '~/helpers';

export default {
	components: {
		ItemImage,
		CardFrame,
	},
	computed: {
		outfits () {
			return this.$store.getters[`${ExploreStore}/${ExploreGetters.getItems}`]('topOutfits');
		},
	},
	created() {
		this.$store.dispatch(`${ExploreStore}/${ExploreActions.fetchItems}`, 'topOutfits');
	},
	methods: {
		totalPrice (post) {
			const total = post.items.map(i => i.price).reduce((a, b) => (a + (+b)), 0);
			return price(post.items[0].currency, total, this._i18n.locale);
		},
		goToLandingPost(post) {
			this.$router.push(`/post/${post._id}`);
		},
	},
};
</script>

<style lang="stylus" scoped>
.px-0
	h3
		font-size 4.92vw
.w-78
	width 62.906vw
	margin-right 3.07vw !important
.outfit-card
	white-space nowrap
	width 250px
	margin-right 10px
	.num_outfit
		margin 2vw 0 5vw 0
		text-align center
		font-size 2.46vw
		letter-spacing 0.2px
		font-weight 700
		padding 2.07vw 0
		border 0.615vw solid #000
		text-transform uppercase
.multi-item,
.scroll-section
	display inline-block
	vertical-align top
.multi-item
	width 100%
	transition-property margin-left
	transition-delay .2s
	&.shifted
		margin-left -65%
		.is_selected
			position relative
			&::after
				content ''
				position absolute
				top 0
				left 0
				width 100%
				height 100%
				z-index 1
				background-color rgba(0,0,0,0.40)
.scroll-section
	position relative
	margin-left -4px
	vertical-align top
	padding 4px
	width 65%
	&.shifted
		&::before
			background -moz-linear-gradient(top,  rgba(218,217,221,0.3) 0%, rgba(255,255,255,0) 100%)
			background -webkit-linear-gradient(top,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
			background linear-gradient(to bottom,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
			height 4.615vw
			width 100%
			content ''
			left 0
			position absolute
			top 0px
		&::after
			background -moz-linear-gradient(top,  rgba(255,255,255,0) 0%, rgba(218,217,221,0.3) 100%)
			background -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%)
			background linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%)
			height 4.615vw
			width 100%
			content ''
			left 0
			position absolute
			bottom 0px
	.scroll-items
		max-height 250px
		overflow auto
		.v-card
			width 85%
			box-shadow none
			&.card_frame:first-child
				margin-top 16px

.grid
	grid-template-columns 1fr 1fr
	grid-template-rows 1fr 1fr
	grid-gap 10px
	&.grid-snap-2
		.v-image
			grid-row-end span 2
	&.grid-snap-3
		grid-template-columns 1.68fr 1fr
		.v-image:first-child
			grid-row-end span 2
.paired_section
	.multi-item
		padding 0 !important
		margin-bottom 0 !important
	.grid
		grid-gap 0.3vw
.grouped-post-item
	min-height 330px
</style>
