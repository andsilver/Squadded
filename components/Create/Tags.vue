<template>
	<div class="shift-card photo-create">
		<slot />
		<CardFrame
			ref="tag-card"
			class="multi-item pa-4 mb-4"
			:class="{ shifted }"
			:show-bag="false"
			@click.native="toggleShifted"
		>
			<ItemImage
				ref="post-main-image"
				:item="post"
				:resquadd="false"
			/>
			<p class="tip">
				{{ $t('tip.createPhotoTag') }}
			</p>
		</CardFrame>
		<div class="scroll-items" :style="{ 'max-height': maxHeight }">
			<SelectItems ref="select-items" :max-count="4" narrow />
		</div>
	</div>
</template>

<script>
import SelectItems from './SelectItems';
import CardFrame from '~/components/Posts/Includes/CardFrame';
import ItemImage from '~/components/Posts/Includes/ItemImage';
import { FeedPost } from '~/classes/FeedPost';

export default {
	name: 'MultiItemPost',
	components: {
		CardFrame,
		ItemImage,
		SelectItems,
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
		toggleShifted () {
			this.maxHeight = `${this.$refs['tag-card'].$el.offsetHeight}px`;
			this.shifted = !this.shifted;
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
	max-height 250px
	margin-left -4px
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
.tip
	color #b8b8ba
	font-size .688em
	font-weight 500
	text-align center
	margin 16px 0 0 0
</style>
