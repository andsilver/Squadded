<template>
	<div class="photo-view">
		<ItemImage
			ref="post-main-image"
			:item="post"
			:resquadd="false"
		/>
	</div>
</template>

<script>
import ItemImage from '../Posts/Includes/ItemImage';
import { FeedPost } from '~/classes/FeedPost';

export default {
	components: {
		ItemImage,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
.photo-view
	width 50vw
	margin 7.38vw auto 5vw
</style>
