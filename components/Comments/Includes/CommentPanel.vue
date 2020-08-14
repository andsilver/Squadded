<template>
	<div ref="comment-panel-box" class="comment-panel-box">
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
import Preloader from '~/components/Preloader.vue';

export default {
	components: {
		CommentItemPanel,
		Preloader,
	},
	props: {
		wishlist: {
			required: true,
			default: null,
		},
	},
};
</script>

<style lang="scss" scoped>
.comment-panel-box {
	display: flex;
    flex-wrap: wrap;
    justify-content: center;
	overflow: auto;
	background: white;
}
</style>
