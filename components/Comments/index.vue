<template>
	<section v-if="post.comments && post.comments.messages" :class="{'for-feed': forFeed}">
		<template v-if="showAllComments || post.comments.messages.length === 1">
			<v-list
				v-if="post.comments.messages.length"
				ref="comments-list"
				class="comment-listing"
			>
				<Comment
					v-for="(comment, n) in post.comments.messages"
					:key="n"
					:comment="comment"
					:post="post"
				/>
			</v-list>
		</template>
		<template v-else-if="post.comments.messages.length">
			<Comment :comment="post.comments.messages[0]" :post="post" />
			<v-btn
				v-if="!showAllComments"
				ref="show-all-btn"
				class="ml-7 font-weight-bold mb-2"
				:class="{'mb-10': !forFeed}"
				small
				text
				@click="showAllComments = true"
			>
				{{ $t('comment.view_all_comments', { n: post.comments.messages.length - 1 }) }}
			</v-btn>
		</template>
		<MessageInput
			v-if="showInput"
			ref="comment-input"
			:class="forFeed ? 'post_comment_input_for_feed' : 'post_comment_input'"
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
		forFeed: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		sendComment: `${PostStore}/${PostActions.sendComment}`,
		showAllComments: true,
	}),
	computed: {
		showInput() {
			return !this.forFeed || (this.post.comments && this.post.comments.messages.length);
		},
	},
	created () {
		return prefetch({
			guid: this.post.guid,
			mutation: `${PostStore}/${PostMutations.receiveComments}`,
			store: this.$store,
			type: 'fetchComments',
			value: this.post.guid,
			key: 'guid',
		}).then(({ comments }) => {
			const { post } = this;
			const myUserId = this.$store.state.user.me.userId;
			comments = comments.filter(c => !commentReported(c));
			this.$store.commit(`${PostStore}/${PostMutations.resetComments}`, { comments, post, myUserId });
			this.scroll();
		});
	},
	mounted () {
		this.showAllComments = this.showAll;
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

.post_comment_input_for_feed
	width 100%
	margin 0 0 24px

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

.for-feed
	.comment-listing
		height unset !important
		>>> .comment
			margin-bottom 8px
			padding-left 16px
	>>> .comment
		margin-bottom 8px
</style>
