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
	&.outfit-snap-4
		width 43.25vw
	&.outfit-snap-3
		width 63.72vw
	&.outfit-snap-2
		width 79.31vw
.grid
	grid-template-columns 1fr 1fr
	grid-template-rows 1fr 1fr
	grid-gap 0.50vw
	&.grid-snap-2
		.v-image
			grid-row-end span 2
	&.grid-snap-3
		grid-template-columns 1.68fr 1fr
		.v-image:first-child
			grid-row-end span 2
</style>
