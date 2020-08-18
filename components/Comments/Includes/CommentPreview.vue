<template>
	<div ref="comment-preview-box" class="comment-preview-box">
		<div v-for="(post, i) in selectedPosts" :key="i" class="comment-preview-item">
			<v-icon :ref="`close-preview-${i}`" size="20px" class="close-preview" @click="$emit('close', post)">
				mdi-close-circle
			</v-icon>
			<img class="comment-preview-image" :src="post.item.img">
		</div>
	</div>
</template>

<script>

export default {
	props: {
		selectedPosts: {
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.comment-preview-box {
    display: flex;
    margin-bottom: 0.8vh;
    overflow-x: auto;

    .comment-preview-item {
        height: 76px;
        width: 60px;
        margin: 1%;
        position: relative;

        .close-preview {
            position: absolute;
            z-index: 3;
            color: black;
            right: 0;
        }

        .comment-preview-image {
            border-radius: 5px;
            width: 52px;
            height: 68px;
            position: absolute;
            bottom: 0;
        }
    }
}
</style>
