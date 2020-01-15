<template>
	<Post
		:post="post"
		:hide-user="isPaired"
	>
		<div class="outfit-card gallery-card">
			<CardFrame
				ref="multi-item"
				class="multi-item pa-4 mb-4"
				:class="{ shifted }"
				:price="totalPrice"
				show-tap
				:post-length="post.items.length"
				:loading="!post.guid && !post.error"
				:post-id="post.guid"
				:is-paired="isPaired"
				@click.native="fetch"
			>
				<ItemImage
					ref="item-image"
					:item="post"
					:resquadd="false"
				/>
			</CardFrame>
			<div v-if="!isPaired" class="scroll-section">
				<div class="scroll-items" :style="{ 'height': maxHeight }">
					<ProductCard
						v-for="item in post.items"
						:key="item.itemId"
						:post-id="post.guid"
						:item="item"
						show-refreshicon
						class="mx-auto mb-4"
					/>
				</div>
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
		isPaired: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		fetched: false,
		shifted: false,
		maxHeight: '115.69vw',
	}),
	computed: {
		totalPrice () {
			const total = this.post.items.map(i => i.price).reduce((a, b) => (a + (+b)), 0);
			return price(this.post.items[0].currency, total, this._i18n.locale);
		},
	},
	methods: {
		fetch () {
			if (this.isPaired) {
				this.$root.$emit('postTaped', '');
				return;
			}
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
.scroll-section
	display inline-block
	vertical-align top
.multi-item
	width 78.46vw
	transition-property margin-left
	transition-delay .2s
	&.shifted
		margin-left -47%
.scroll-section
	position relative
	margin-left -4px
	vertical-align top
	padding 4px
	width 65%
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
		width 100%
		padding 0 !important
		margin 0 !important
</style>
