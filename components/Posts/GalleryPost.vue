<template>
	<Post
		:post="post"
		:hide-user="isPaired"
	>
		<MountedEmitter
			ref="card"
			class="outfit-card gallery-card"
			@mounted="bindEvents"
		>
			<CardFrame
				ref="multi-item"
				class="multi-item pa-2"
				:class="{ shifted, moving }"
				:price="totalPrice"
				show-tap
				:post-length="post.items.length"
				:loading="!post.guid && !post.error"
				:post-id="post.guid"
				:is-paired="isPaired"
				:style="{
					'margin-left': `${marginLeft}px`,
				}"
				:post="post"
				@click.native="fetch"
			>
				<VideoView v-if="post.type === 'videoPost'" :value="post.videoLink" />
				<ItemImage
					v-else
					ref="item-image"
					:item="post"
					:resquadd="false"
				>
					<TagButton
						v-for="(coord, index) in coords"
						:key="index"
						class="tag-button"
						:style="{ top: coord.y + '%', left: coord.x + '%' }"
						@click="() => tagClick(coord)"
					/>
				</ItemImage>
			</CardFrame>
			<div v-if="!isPaired" class="scroll-section">
				<div ref="items" class="scroll-items">
					<ProductCard
						v-for="item in post.items"
						ref="item"
						:key="item.itemId"
						:post-id="post.guid"
						:post="post"
						:item="item"
						:shifted="shifted"
						show-refreshicon
						class="mx-auto mb-4"
						@shift="fetch"
					/>
				</div>
			</div>
		</MountedEmitter>
	</Post>
</template>

<script>
import Post from './Includes/Post';
import CardFrame from './Includes/CardFrame';
import ItemImage from './Includes/ItemImage';
import TagButton from './Includes/TagButton';
import ProductCard from './Includes/ProductCard';
import MountedEmitter from '~/components/common/MountedEmitter';
import VideoView from '~/components/common/VideoView';
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
		TagButton,
		MountedEmitter,
		VideoView,
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
		moving: false,
		marginLeft: 0,
		prev: 999,
		moved: false,
	}),
	computed: {
		totalPrice () {
			const total = this.post.items.map(i => i.price).reduce((a, b) => (a + (+b)), 0);
			return price(this.post.items[0].currency, total, this._i18n.locale);
		},
		coords () {
			return this.post.coords || [];
		},
	},
	methods: {
		bindEvents () {
			if (!this.$refs.card || !this.$refs.card.$el) {
				return;
			}
			this.$refs.card.$el.addEventListener('touchstart', e => this.onStart(e));
			this.$refs.card.$el.addEventListener('touchmove', e => this.onMove(e));
		},
		fetch (tagClicked) {
			if (this.isPaired) {
				return this.$root.$emit('postTaped', this.post.postId);
			}
			if (this.fetched || this.post.guid.includes('new')) {
				return this.toggleShifted();
			}
			prefetch({
				guid: this.post.guid,
				mutation: `${PostStore}/${PostMutations.resquaddHasUpdated}`,
				store: this.$store,
				type: 'fetchReSquadded',
			}).then(() => this.toggleShifted(tagClicked));
		},
		toggleShifted (tagClicked) {
			this.fetched = true;
			this.shifted = tagClicked ? true : !this.shifted;
			this.marginLeft = this.shifted ? -this.$refs.items.offsetWidth : 0;
			this.moving = false;
		},
		tagClick (coord) {
			let index = this.post.items.findIndex(item => item.itemId === coord.id);
			if (index === -1) {
				index = 0;
			}
			if (!this.$refs.item) {
				return;
			}
			const item = this.$refs.item[index];
			this.$refs.items.scrollTo({
				top: item.$el.offsetTop - 80,
				behavior: 'smooth',
			});
			this.fetch();
		},
		onStart (e) {
			this.prev = e.touches[0].clientX;
			this.moving = true;
		},
		onMove (e) {
			if (!this.moving) {
				return;
			}
			const current = e.touches[0].clientX;
			const trans = current - this.prev;
			const margin = this.marginLeft + trans;
			this.prev = current;
			if (Math.abs(trans) < 6 ||
				(trans > 0 && !this.shifted) ||
				(trans < 0 && this.shifted)
			) {
				this.moved = false;
			} else {
				this.moved = true;
				this.marginLeft = margin;
			}
			this.onEnd();
		},
		onEnd (e) {
			if (this.moved) {
				this.fetch();
			}
			this.moving = false;
			this.moved = false;
		},
	},
};
</script>

<style lang="stylus" scoped>
.outfit-card
	position relative
	white-space nowrap
	width 100%
.multi-item,
.scroll-section
	display inline-block
	vertical-align top
.multi-item
	width 100%
	transition margin-left linear .2s
.moving
	transition margin-left linear !important
.scroll-section
	position absolute
	height 100%
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
		height 100%
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
.item-image
	position relative
.tag-button
	position absolute
.shifted
	@media screen and (max-width 280px)
		margin-left -60% !important
</style>
