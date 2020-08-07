<template>
	<Post :post="post" hide-caption class="grouped-post">
		<QuestionCard ref="questioncard" :background="post.background" @mounted="setAutosize">
			<textarea
				ref="posttext"
				v-model="post.text"
				:style="{ color: post.color }"
				class="text-center"
				disabled
			/>
		</QuestionCard>
	</Post>
</template>

<script>
import autosize from 'autosize';
import Post from './Includes/Post';
import QuestionCard from '~/components/Posts/Includes/QuestionCard';
import { FeedPost } from '~/classes/FeedPost';

export default {
	name: 'QuestionPost',
	components: {
		Post,
		QuestionCard,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
	methods: {
		setAutosize() {
			autosize(this.$refs.posttext);
		},
	},
};
</script>
<style lang="scss" scoped>
textarea {
	width: 100%;
	resize: none;
	text-align: center;
	font-size: 14px;
	font-weight: 600;
	overflow: hidden !important;

	&:focus,
	&:active {
		border: none;
		outline: none;
	}
}
</style>
