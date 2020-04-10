<template>
	<Post
		:post="post"
		:hide-user="isPaired"
	>
		<MountedEmitter
			ref="card"
			class="outfit-card"
			@mounted="bindEvents"
		>
			<CardFrame
				ref="multi-item"
				class="multi-item pa-4"
				:class="{ shifted, moving }"
				:price="totalPrice"
				:origin-price="originPrice"
				show-tap
				:post-length="post.items.length"
				:loading="!post.guid && !post.error"
				:post-id="post.guid"
				:is-paired="isPaired"
				:style="{
					'margin-left': `${marginLeft}px`,
				}"
				@click.native="fetch"
			>
				<div class="grid" :class="`grid-snap-${post.items.length}`">
					<ItemImage
						v-for="(item , index) in post.items"
						ref="item-image"
						:key="item.itemId"
						:item="item"
						:resquadd="false"
						:class="{ is_selected: selectedItem == item.itemId }"
						@click.native="() => imageSelected(item.itemId, index)"
					/>
				</div>
			</CardFrame>
			<div v-if="!isPaired" class="scroll-section" :class="{ shifted }">
				<span class="close" @click="fetch"><img src="~assets/img/close-white.svg" class="close-image"></span>
				<div ref="items" class="scroll-items fancy_scroll" :style="{ 'max-height': maxHeight }">
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
import ProductCard from './Includes/ProductCard';
import { prefetch, price } from '~/helpers';
import { FeedPost } from '~/classes/FeedPost';
import { PostStore, PostMutations } from '~/store/post';
import MountedEmitter from '~/components/common/MountedEmitter';

export default {
	name: 'MultiItemPost',
	components: {
		CardFrame,
		ItemImage,
		Post,
		ProductCard,
		MountedEmitter,
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
		maxHeight: '250px',
		selectedItem: '',
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
		originPrice () {
			const total = this.post.items.map(i => i.price).reduce((a, b) => (a + (+b)), 0);
			const orgtotal = this.post.items.map(i => i.origPrice || i.price).reduce((a, b) => (a + (+b)), 0);
			if (orgtotal !== total) {
				return price(this.post.items[0].currency, orgtotal, this._i18n.locale);
			} else {
				return '';
			}
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
		fetch () {
			if (this.isPaired) {
				this.$root.$emit('postTaped', this.post.postId);
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
			this.maxHeight = `${(this.$refs['multi-item'].$el.offsetHeight - 7)}px`;
			this.shifted = !this.shifted;
			if (!this.shifted) {
				this.selectedItem = '';
			}
			this.marginLeft = this.shifted ? -185 : 0;
			this.moving = false;
		},
		imageSelected (itemId, index) {
			if (!this.shifted && !this.isPaired) {
				if (index === -1) {
					index = 0;
				}
				const item = this.$refs.item[index];
				this.$refs.items.scrollTo({
					top: item.$el.offsetTop - 24,
					behavior: 'smooth',
				});
			}
			this.selectedItem = itemId;
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
	white-space nowrap
	width 100%
.multi-item,
.scroll-section
	display inline-block
	vertical-align top
	.close
		position absolute
		opacity 0
		width 8.61vw
		height 8.61vw
		background-color rgba(0,0,0,0.20)
		z-index: 1
		top: 1.92vw
		left: 1.92vw
		border-radius 50%
		display flex
		justify-content center
		align-items center
		transition all .2s
		cursor pointer
		img.close-image
			width 3.69vw
			height 3.69vw
		&:hover
			width 9.53vw
			height 9.53vw
			background-color rgba(0,0,0,0.40)
	&.shifted .close
		opacity 1
.multi-item
	width 100%
	transition margin-left linear .2s
	margin-bottom 2.969vw
	&.shifted
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
.moving
	transition margin-left linear !important
.scroll-section
	position relative
	margin-left -4px
	vertical-align top
	padding 4px
	width 70%
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
		&.shifted
			margin-left 0
			.is_selected::after
				background-color transparent
	.grid
		grid-gap 0.3vw
.isTouch .close
	display none
.fancy_scroll
	-webkit-overflow-scrolling touch
.fancy_scroll::-webkit-scrollbar-thumb
	background-color #B8B8BA
	outline 0
.fancy_scroll::-webkit-scrollbar
	width 5px
</style>
