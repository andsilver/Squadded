<template>
	<section>
		<template v-if="showAll || post.comments.messages.length === 1">
			<v-list v-if="post.comments.messages.length" ref="comments-list" class="comment-listing">
				<Comment
					v-for="comment in post.comments.messages"
					:key="comment.correlationId || comment._id"
					:comment="comment"
					:post="post"
				/>
			</v-list>
		</template>
		<template v-else-if="post.comments.messages.length">
			<Comment :comment="post.comments.messages[0]" :post="post" />
			<v-btn ref="show-all-btn" v-if="!showAll" class="ml-10 mb-10 font-weight-bold" small text @click="showAll = true">
				{{ $t('comment.view_all_comments', { n: post.comments.messages.length }) }}
			</v-btn>
		</template>
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
import { commentReported } from '~/utils/reportSession';

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
		showAll: {
			type: Boolean,
			default: true,
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
			const myUserId = this.$store.state.user.me.userId;
			comments = comments.filter(c => !commentReported(c));
			this.$store.commit(`${PostStore}/${PostMutations.resetComments}`, { comments, post, myUserId });
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
	padding 2.30vw 4.61vw
	position fixed
	width 100%
	z-index 4
	height: 15.38vw;
	&::before
		background -moz-linear-gradient(top,  rgba(255,255,255,0) 0%, rgba(218,217,221,0.3) 100%)
		background -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%)
		background linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%)
		height 4.615vw
		width 100%;
		content ''
		left 0
		position absolute
		top -18px

.v-application.isTouch:not(.show-tabs) .post_comment_input
	bottom 0
.comment-listing
	height calc(100vh - 230px)
	overflow-y auto
	padding-top 0px
	overflow-x hidden
	margin-left -12px
	margin-right -12px
	padding-right 12px
.show-tabs .comment-listing
	height calc(100vh - 305px)
</style>
