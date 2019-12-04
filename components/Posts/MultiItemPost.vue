<template>
	<Post
		:post="post"
	>
		<div class="outfit-card">
			<CardFrame
				ref="multi-image"
				class="multi-image pa-4 mb-4"
				:class="{ shifted }"
				:price="post.total"
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
import { prefetch } from '~/helpers';
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
			this.maxHeight = `${this.$refs['multi-image'].$el.offsetHeight}px`;
			this.shifted = !this.shifted;
		},
	},
};
</script>

<style lang="stylus" scoped>
.outfit-card
	white-space nowrap
	width 100%
.multi-image,
.scroll-items
	display inline-block
	vertical-align top
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
	.v-card
		width 75%
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
