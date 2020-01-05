<template>
	<div class="outfit-view" :class="`outfit-snap-${post.length}`">
		<div class="grid" :class="`grid-snap-${post.length}`">
			<ItemImage
				v-for="item in post"
				ref="item-image"
				:key="item.itemId"
				:item="item"
				:resquadd="false"
			/>
		</div>
		<span class="poll-icon">
			<img src="~assets/img/poll-arrows.svg" class="poll-image">
		</span>
	</div>
</template>

<script>
import ItemImage from '../Posts/Includes/ItemImage';

export default {
	components: {
		ItemImage,
	},
	props: {
		post: {
			type: Array,
			required: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
.outfit-view
	margin-top 7.38vw
	margin-bottom 5vw
	position relative
	&.outfit-snap-2
		width 73.23vw
	span.poll-icon
		width 8.95vw
		height 8.95vw
		background-color #000
		border-radius 50%
		display flex
		justify-content center
		left 44%
		top 40.5%
		position absolute
		border 0.615vw solid #ffffff
		img.poll-image
			width 4.46vw
			margin-left 0.1vw
.grid
	grid-template-columns 1fr 1fr
	grid-template-rows 0fr 1fr
	grid-gap 0.50vw
	&.grid-snap-2
		.v-image
			grid-row-end span 2
	&.grid-snap-3
		grid-template-columns 1.68fr 1fr
		.v-image:first-child
			grid-row-end span 2
</style>
