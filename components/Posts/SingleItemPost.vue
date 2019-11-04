<template>
	<Post
		:post="post"
	>
		<ProductCard
			ref="product-card"
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
.product_card
	border-radius 0 !important
	box-shadow 0 2px 4px rgba(0, 0, 0, 0.1) !important

	.double_heart_button
		position absolute
		width 30px
		height 30px
		opacity .5
		right 4%
		top 4%
		color white
		background-color #707070
		border-radius 50%
		text-align center

	.card_bottom
		margin-top 2%

	.post_price
		padding 0

	.post_price span
		font-size .9em
		font-weight 700

	.post_title
		margin-top 1%
		padding 0
		width 85%

	.post_title span
		min-height 12px
		max-height 20px
		word-break normal
		overflow hidden
		font-size 10px
		line-height 10px
		font-weight 500
		color #B8B8BA

	.buy_button
		width 30px
		height 30px
		position absolute
		right 5%
		bottom 4%

	.sqdi-shopping-bag-2:before
		position absolute
		font-size 1.3em
		right -30%
		top 10%
</style>
