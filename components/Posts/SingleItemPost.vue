<template>
	<Post :post="post" class="single-post">
		<ProductCard
			ref="product-card"
			class="mx-auto pa-2 w-70 mb-4 single-item"
			:item="post.item"
			:post="post"
			show-refreshicon
			:loading="!post.guid && !post.error"
			:post-id="post.guid"
		/>
	</Post>
</template>

<script>
import Post from './Includes/Post';
import ProductCard from './Includes/ProductCard';
import { FeedPost } from '~/classes/FeedPost';

export default {
	name: 'SingleItemPost',
	components: {
		Post,
		ProductCard,
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
.w-70 {
	width: 70vw;
}
</style>
