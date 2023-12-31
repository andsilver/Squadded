<template>
	<section v-if="post.comments && post.comments.messages" :class="{ 'for-feed': forFeed, margin: showInput || comments.length }">
		<span v-observe-visibility="visibilityChanged" :class="{ hide_visibility: visible }" class="visibility" />
		<template v-if="visible">
			<template v-if="showAllComments || comments.length === 1">
				<v-list v-if="comments.length" ref="comments-list" class="comment-listing">
					<component
						:is="!!comment.items ? 'CommentEmbeddedItem': 'Comment'"
						v-for="(comment, n) in comments"
						:key="n"
						:comment="comment"
						:post="post"
						:for-feed="forFeed"
					/>
				</v-list>
			</template>
			<template v-else-if="comments.length">
				<component
					:is="!!comments[comments.length - 1].items ? 'CommentEmbeddedItem': 'Comment'"
					:comment="comments[comments.length - 1]"
					:post="post"
					:for-feed="forFeed"
				/>
				<v-btn
					v-if="!showAllComments"
					ref="show-all-btn"
					class="font-weight-bold mb-2 allcomment"
					:class="{ 'mb-10': !forFeed }"
					small
					text
					@click="goToReactions"
				>
					{{ $t('comment.view_all_comments', { n: comments.length }) }}
				</v-btn>
			</template>
			<MessageInput
				ref="comment-input"
				:class="{
					comment_input: true,
					post_comment_input_for_feed: forFeed,
					post_comment_input: !forFeed,
					hide_comment_input: !showInput,
					post_comment_input_unexpanded: !forFeed && !isPanelOpen,
					post_comment_input_expanded: !forFeed && isPanelOpen
				}"
				:action="sendComment"
				:placeholder="$t('input.placeholder')"
				:post="post"
				:for-feed="forFeed"
				:is-panel-open-props.sync="isPanelOpen"
				user-link
				@send="scroll"
			/>
		</template>
	</section>
</template>

<script>
import Comment from './Includes/Comment';
import CommentEmbeddedItem from './Includes/CommentEmbeddedItem';
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
		CommentEmbeddedItem,
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
		visible: false,
		showInput: false,
		isPanelOpen: false,
	}),
	computed: {
		comments() {
			const messages = Object.assign([], this.post.comments ? this.post.comments.messages : []);
			return messages && messages.length ? messages : [];
		},
	},
	created() {
		if (!this.forFeed) {
			this.showInput = true;
		}
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
		});
	},
	mounted() {
		this.showAllComments = this.showAll;
	},
	methods: {
		scroll() {
			if (this.forFeed) {
				return;
			}
			setTimeout(() => {
				const { $el } = this;
				if (!$el) {
					return;
				}
				window.scroll({
					top: getScroll($el.getBoundingClientRect(), window.scrollY),
					behavior: 'smooth',
				});

				if (this.$refs['comments-list']) {
					this.$refs['comments-list'].$el.scroll({
						top: 9999,
						behavior: 'smooth',
					});
				}
			}, 10);
		},
		goToReactions() {
			this.$router.push(`/post/${this.post.guid}/reactions`);
		},
		visibilityChanged(isVisible) {
			this.visible = this.visible || isVisible;
		},
	},
};
</script>

<style lang="stylus" scoped>
.post_comment_input
	background #fff
	left 0
	padding 2.30vw 4.61vw
	position fixed
	z-index 4
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

.post_comment_input_unexpanded
	bottom 65px

.post_comment_input_expanded
	bottom 37vh

.comment_input
	width 100%
	transition all linear .2s
	opacity 1
.v-application:not(.show-tabs) .post_comment_input
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
	&.margin
		margin-top 2.87vw
	.allcomment.v-btn
		color #B8B8BA
		font-size 2.92vw
		text-transform inherit
		letter-spacing 0
		font-weight 600 !important
		line-height 3.66vw
		margin-bottom 3.83vw !important
		height auto !important
		padding 0 1.53vw
	.post_comment_input_for_feed
		.v-text-field input
			font-size 3.23vw
			font-weight 500
			line-height 4.30vw
			color #B8B8BA
		.v-input__slot
			background #ffffff !important
	.comment-listing
		height unset !important
		>>> .comment
			margin-bottom 8px
			padding-left 16px
	>>> .comment
			margin-bottom 1vw
.visibility
	width 0px
	height 41.19px
	display block
	background transparent

.hide_comment_input
	height 1px
	opacity 0
	overflow hidden
	margin 0

.hide_visibility
	height 0
</style>
