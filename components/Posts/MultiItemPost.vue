<template>
	<Post
		:post="post"
	>
		<CardFrame
			ref="product-card"
			class="product-card mx-auto pa-4 w-78 mb-4"
			:price="post.total"
			:loading="!post.guid && !post.error"
		>
			<div
				ref="multi-image"
				class="multi-image"
				:class="{ shifted }"
				@click="toggleShifted"
			>
				<div class="grid" :class="`grid-snap-${post.items.length}`">
					<ItemImage
						v-for="item in post.items"
						ref="item-image"
						:key="item.itemId"
						:item="item"
					/>
				</div>
			</div>
			<div v-show="shifted" class="scroll-items" :style="{ 'max-height': maxHeight }">
				<ProductCard
					v-for="item in post.items"
					:key="item.itemId"
					:item="item"
					class="mb-4"
				/>
			</div>
		</CardFrame>
	</Post>
</template>

<script>
import Post from './Includes/Post';
import CardFrame from './Includes/CardFrame';
import ItemImage from './Includes/ItemImage';
import ProductCard from './Includes/ProductCard';
import { FeedPost } from '~/classes/FeedPost';

export default {
	name: 'MultiItemPost',
	components: {
		CardFrame,
		ItemImage,
		Post,
		ProductCard,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
	data: () => ({
		shifted: false,
		maxHeight: '250px',
	}),
	methods: {
		toggleShifted () {
			this.maxHeight = `${this.$refs['multi-image'].offsetHeight}px`;
			this.shifted = !this.shifted;
		},
	},
};
</script>

<style lang="stylus" scoped>
.product-card
	white-space nowrap
.multi-image,
.scroll-items
	display inline-block
.multi-image
	width 100%
	transition-property margin-left
	transition-delay .2s
	&.shifted
		margin-left -75%
.scroll-items
	width 75%
	max-height 250px
	padding 4px
	overflow auto
.grid
	grid-template-columns 1fr 1fr
	grid-template-rows 1fr 1fr
	grid-gap 10px
	&.grid-snap-2
		.v-image
			grid-row-end span 2
	&.grid-snap-3
		.v-image:first-child
			grid-row-end span 2
</style>
