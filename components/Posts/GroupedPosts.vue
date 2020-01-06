<template>
	<Post ref="grouped-post" :post="selected">
		<v-slide-group center-active mandatory>
			<v-slide-item
				v-for="(item, index) of post.items"
				:key="index"
				v-slot:default="{ active, toggle }"
			>
				<ProductCard
					ref="product-card"
					class="mx-auto pa-4 w-78 mb-4 single-item"
					:item="item.item"
					show-refreshicon
					:loading="!item.guid && !item.error"
					:post-id="item.guid"
					@click.native="itemSelected(toggle, item)"
				/>
			</v-slide-item>
		</v-slide-group>
	</Post>
</template>

<script>
import Post from './Includes/Post';
import ProductCard from './Includes/ProductCard';

export default {
	components: {
		Post,
		ProductCard,
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
		itemSelected(toggle, item) {
			toggle();
			this.selectedItem = item;
		},
	},
};
</script>

<style lang="stylus" scoped>
.w-78 {
	width: 62.906vw;
}

.items-container {
	display: flex;
	overflow-x: scroll;
}
</style>