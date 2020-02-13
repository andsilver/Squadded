<template>
	<div class="shift-card photo-create">
		<slot />
		<CardFrame
			ref="tag-card"
			class="multi-item pa-4 mb-4"
			:class="{ shifted }"
			:show-bag="false"
		>
			<ItemImage
				v-if="!cropActive"
				ref="post-main-image"
				:item="post"
				:resquadd="false"
				@click.native="toggleShifted"
			/>
			<ImageCrop v-if="cropActive" ref="photo-crop-view" :item="post" @doneCrop="$emit('doneCrop')" />
			<p v-if="!cropActive" class="tip">
				{{ $t('tip.createPhotoTag') }}
			</p>
		</CardFrame>
		<div class="scroll-items">
			<SelectItems ref="select-items" :is-photo="true" :max-count="4" narrow :style="{ 'max-height': maxHeight }" />
		</div>
	</div>
</template>

<script>
import SelectItems from './SelectItems';
import CardFrame from '~/components/Posts/Includes/CardFrame';
import ImageCrop from '~/components/Posts/Includes/ImageCrop';
import ItemImage from '~/components/Posts/Includes/ItemImage';
import { FeedPost } from '~/classes/FeedPost';

export default {
	name: 'MultiItemPost',
	components: {
		CardFrame,
		ItemImage,
		SelectItems,
		ImageCrop,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
		cropActive: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data: () => ({
		searchText: '',
		fetched: false,
		shifted: false,
		maxHeight: '250px',
	}),
	methods: {
		toggleShifted () {
			if (!this.cropActive) {
				this.maxHeight = `${(this.$refs['tag-card'].$el.offsetHeight - 40)}px`;
				this.shifted = !this.shifted;
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.shift-card
	white-space nowrap
	width 100%
	margin-top 4.30vw
.multi-item,
.scroll-items
	display inline-block
	vertical-align top
.multi-item
	min-width calc(100% - 70px)
	transition-property margin-left
	transition-delay .2s
	&.shifted
		margin-left -60%
.scroll-items
	width 65%
	margin-left -4px
	overflow auto
	padding-top 40px
	position relative
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
.tip
	color #b8b8ba
	font-size .688em
	font-weight 500
	text-align center
	margin 16px 0 0 0
.scroll-items::before
	background -moz-linear-gradient(top,  rgba(218,217,221,0.3) 0%, rgba(255,255,255,0) 100%)
	background -webkit-linear-gradient(top,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
	background linear-gradient(to bottom,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
	height 4.615vw
	width 100%
	content ''
	left 0
	position absolute
.scroll-items::after
	background -moz-linear-gradient(top,  rgba(255,255,255,0) 0%, rgba(218,217,221,0.3) 100%)
	background -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%)
	background linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%)
	height 4.615vw
	width 100%
	content ''
	left 0
	position absolute
	bottom 0px
.multi-item
	max-width calc(100% - 80px)
</style>
