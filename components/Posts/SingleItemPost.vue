<template>
	<Post
		:post="post"
	>
		<ProductCard
			ref="product-card"
			class="mx-auto pa-4 w-78 mb-4"
			:item="post.item"
			:loading="!post.guid && !post.error"
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
.w-78
	width 78%
</style>
