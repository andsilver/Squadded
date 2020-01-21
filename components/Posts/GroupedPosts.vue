<template>
	<Post ref="grouped-post" :post="selected" group-post class="grouped-post">
		<div class="overflow-x-auto d-flex px-2">
			<div v-for="(item, index) of post.items" :key="index" class="grouped-post-item">
				<ProductCard
					ref="product-card"
					class="mx-auto pa-4 w-78 mb-4 single-item"
					:item="item.item"
					show-refreshicon
					:loading="!item.guid && !item.error"
					:post-id="item.guid"
					:post="post.items[index]"
					group-post
					@mousedown.native="() => itemSelected(item)"
					@touchstart.native="() => itemSelected(item)"
				/>
			</div>
		</div>
		<Comments
			ref="post-comments"
			class="mt-4 px-2"
			:post="selected"
			:show-all="false"
			:for-feed="true"
		/>
	</Post>
</template>

<script>
import Post from './Includes/Post';
import ProductCard from './Includes/ProductCard';
import Comments from '~/components/Comments';

export default {
	components: {
		Post,
		ProductCard,
		Comments,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		selectedItem: null,
		self: this,
	}),
	computed: {
		selected() {
			return this.selectedItem || this.post.items[0];
		},
	},
	methods: {
		itemSelected(item) {
			this.selectedItem = item;
		},
	},
};
</script>

<style lang="stylus" scoped>
.w-78
	width 62.906vw
	margin-right 3.07vw !important
.items-container
	display: flex
	overflow-x scroll
.grouped-post
	margin-left -12px
	margin-right -12px
</style>
