<template>
	<section>
		<v-list v-if="post.comments.messages.length" ref="comments-list">
			<Comment
				v-for="comment in post.comments.messages"
				:key="comment.correlationId || comment._id"
				:comment="comment"
			/>
		</v-list>
		<MessageInput
			ref="comment-input"
			class="post_comment_input"
			:action="sendComment"
			:placeholder="$t('input.placeholder')"
			:post="post"
			user-link
			@send="scroll"
		/>
	</section>
</template>

<script>
import Comment from './Includes/Comment';
import MessageInput from '~/components/MessageInput';
import { PostActions, PostMutations, PostStore } from '~/store/post';
import { prefetch } from '~/helpers';

const TAB_BAR_HEIGHT = 65;
const GAP = 5;

const getScroll = (rect, scrollTop) => rect.top + scrollTop - window.innerHeight + rect.height + TAB_BAR_HEIGHT + GAP;

export default {
	components: {
		Comment,
		MessageInput,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		sendComment: `${PostStore}/${PostActions.sendComment}`,
	}),
	created () {
		return prefetch({
			guid: this.post.guid,
			mutation: `${PostStore}/${PostMutations.receiveReaction}`,
			store: this.$store,
			type: 'fetchComments',
		}).then((comments) => {
			const { post } = this;
			this.$store.commit(`${PostStore}/${PostMutations.resetComments}`, { comments, post });
			this.scroll();
		});
	},
	methods: {
		scroll () {
			setTimeout(() => {
				const { $el } = this;
				window.scroll({
					top: getScroll($el.getBoundingClientRect(), window.scrollY),
					behavior: 'smooth',
				});
			}, 10);
		},
	},
};
</script>

<style lang="stylus" scoped>
.post_comment_input
	background #fff
	bottom 65px
	left 0
	padding 0 12px
	position fixed
	width 100%
	z-index 4

.v-application.isTouch:not(.show-tabs) .post_comment_input
	bottom 0
</style>
