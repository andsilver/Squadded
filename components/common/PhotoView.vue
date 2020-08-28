<template>
	<div class="photo-view">
		<ItemImage
			ref="post-main-image"
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
	</div>
</template>

<script>
import ItemImage from '../Posts/Includes/ItemImage';
import TagButton from '~/components/Posts/Includes/TagButton';
import { FeedPost } from '~/classes/FeedPost';

export default {
	components: {
		ItemImage,
		TagButton,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
		coords: {
			type: Array,
			default: () => [],
		},
	},
};
</script>

<style lang="stylus" scoped>
.photo-view
	width 42.036vw
	margin 7.38vw auto 5vw
.tag-button
	position absolute
</style>
