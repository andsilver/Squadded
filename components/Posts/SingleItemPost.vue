<template>
	<Post :post="post" group-post class="grouped-post single-post">
		<ProductCard
			ref="product-card"
			class="mx-auto pa-4 w-78 mb-4 single-item"
			:item="post.item"
			:post="post"
			show-refreshicon
			group-post
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
.w-78 {
	width: 62.906vw;
}
</style>
