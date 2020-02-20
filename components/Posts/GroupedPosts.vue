<template>
	<Post ref="grouped-post" :post="selected" group-post class="grouped-post">
		<div>
			<v-slide-group v-model="model" center-active mandatory>
				<v-slide-item
					v-for="(item, index) of post.items"
					:key="index"
					v-slot:default="{ active, toggle }"
				>
					<ProductCard
						ref="product-card"
						v-touch:swipe.right="prev"
						v-touch:swipe.left="next"
						class="mx-auto pa-4 w-78 mb-4 single-item"
						:item="item.item"
						show-refreshicon
						:loading="!item.guid && !item.error"
						:post-id="item.guid"
						:post="post.items[index]"
						:class="{ is_selected: index == selectedIndex }"
						group-post
						@click.native="itemSelected(toggle, item, index)"
					/>
				</v-slide-item>
			</v-slide-group>
			<v-btn v-if="!firstSelcted" ref="prev-item" icon class="prev-item" @click="prev">
				<v-icon>
					mdi-chevron-left
				</v-icon>
			</v-btn>
			<v-btn v-if="!lastSelcted" ref="next-item" icon class="next-item" @click="next">
				<v-icon>
					mdi-chevron-right
				</v-icon>
			</v-btn>
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
		selectedIndex: 1,
		self: this,
		model: 1,
		firstSelcted: false,
		lastSelcted: false,
	}),
	computed: {
		selected() {
			return this.selectedItem || this.post.items[0];
		},
	},
	mounted () {
		if (this.post.items.length === 2) {
			this.model = 0;
			this.selectedIndex = 0;
			this.firstSelcted = true;
		}
	},
	methods: {
		itemSelected(toggle, item, index) {
			toggle();
			this.selectedItem = item;
			this.selectedIndex = index;
		},
		next() {
			this.firstSelcted = false;
			if (this.selectedIndex === this.post.items.length - 1) {
				return;
			}
			const posts = this.$refs['product-card'];
			const nextPost = posts[this.selectedIndex + 1];
			if (this.selectedIndex + 1 === this.post.items.length - 1) {
				this.lastSelcted = true;
			}
			nextPost.$el.click();
		},
		prev() {
			this.lastSelcted = false;
			if (this.selectedIndex === 0) {
				return;
			}
			const posts = this.$refs['product-card'];
			const prevPost = posts[this.selectedIndex - 1];
			if ((this.selectedIndex - 1) === 0) {
				this.firstSelcted = true;
			}
			prevPost.$el.click();
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
	.prev-item,
	.next-item
		position absolute
		top calc(50% - 24px)
		border-radius 50%
		background white
		z-index 3
	.next-item
		right 24px
	.prev-item
		left 24px
	.next-item--disabled,
	.prev-item--disabled
		display none
	.single-item:last-child
		margin-right 15.5vw !important
	.single-item:first-child
		margin-left 15.5vw !important
.isTouch .grouped-post
	.prev-item,
	.next-item
		display none
</style>
