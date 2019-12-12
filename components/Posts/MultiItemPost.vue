<template>
	<Post
		:post="post"
	>
		<div class="outfit-card">
			<CardFrame
				ref="multi-item"
				class="multi-item pa-4 mb-4"
				:class="{ shifted }"
				:price="totalPrice"
				show-tap
				:post-length="post.items.length"
				:loading="!post.guid && !post.error"
				@click.native="fetch"
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
			</CardFrame>
			<div class="scroll-items" :style="{ 'max-height': maxHeight }">
				<ProductCard
					v-for="item in post.items"
					:key="item.itemId"
					:item="item"
					show-refreshicon
					class="mx-auto mb-4"
				/>
			</div>
		</div>
	</Post>
</template>

<script>
import Post from './Includes/Post';
import CardFrame from './Includes/CardFrame';
import ItemImage from './Includes/ItemImage';
import ProductCard from './Includes/ProductCard';
import { prefetch, price } from '~/helpers';
import { FeedPost } from '~/classes/FeedPost';
import { PostStore, PostMutations } from '~/store/post';

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
		fetched: false,
		shifted: false,
		maxHeight: '250px',
	}),
	computed: {
		totalPrice () {
			const total = this.post.items.map(i => i.price).reduce((a, b) => (a + (+b)), 0);
			return price(this.post.items[0].currency, total, this._i18n.locale);
		},
	},
	methods: {
		fetch () {
			if (this.fetched) {
				return this.toggleShifted();
			}
			prefetch({
				guid: this.post.guid,
				mutation: `${PostStore}/${PostMutations.resquaddHasUpdated}`,
				store: this.$store,
				type: 'fetchReSquadded',
			}).then(this.toggleShifted.bind(this));
		},
		toggleShifted () {
			this.fetched = true;
			this.maxHeight = `${this.$refs['multi-item'].$el.offsetHeight}px`;
			this.shifted = !this.shifted;
		},
	},
};
</script>

<style lang="stylus" scoped>
.outfit-card
	white-space nowrap
	width 100%
.multi-item,
.scroll-items
	display inline-block
	vertical-align top
.multi-item
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
	.v-card
		width 85%
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
