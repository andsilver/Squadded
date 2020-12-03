<template>
	<v-img ref="comment-item-panel" :src="post.item.img" :class="{'item-selected': post.selected}" class="item-panel-image" @click="$emit('selectEmbeddedItem', post)">
		<v-row v-if="post.selected" class="selected-image-box" justify="center" align="center">
			<img class="selected-image" src="~assets/img/selected.svg">
		</v-row>
	</v-img>
</template>

<script>
import { FeedPost } from '~/classes/FeedPost';

export default {
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.item-panel-image {
    border-radius: 8px;
	flex: 0 0 31.5%;
	margin: 0.5%;
	height: 140px;

	.selected-image-box {
		height: 100%;
		margin: 0;
		background: rgba(26, 23, 23, 0.5);

		.selected-image {
			width: 40px;
		}
	}
}
</style>
