<template>
	<div ref="comment-panel-box" class="comment-panel-box d-flex flex-wrap">
		<Preloader v-if="!wishlist" ref="preloader" class="mt-8" />
		<CommentItemPanel
			v-for="(post, n) in wishlist"
			v-else
			:ref="`comment-item-panel-${n}`"
			:key="n"
			:post="post"
			@selectEmbeddedItem="post => $emit('selectEmbeddedItem', post)"
		/>
	</div>
</template>

<script lang="js">
import CommentItemPanel from '~/components/Comments/Includes/CommentItemPanel';
import Preloader from '~/components/Preloader';

export default {
	components: {
		CommentItemPanel,
		Preloader,
	},
	props: {
		wishlist: {
			type: Array,
			required: true,
			default: null,
		},
	},
};
</script>

<style lang="scss" scoped>
.comment-panel-box {
	overflow: auto;
	background: white;
}
</style>
