<template>
	<div class="full_post">
		<UserLink ref="user-link" class="post_user_link" :user="post.user" :ts="post.ts" />
		<h3
			v-if="isTextVisible"
			ref="post-text"
			:class="{card_title: true, placeholder: isPlaceHolder}"
			@click="toggleTextEditor"
		>
			{{ post.text || (isPlaceHolder && $t('post.textPlaceholder')) }}
		</h3>
		<MessageInput
			v-if="showTextEditor"
			ref="post-text-input"
			class="mb-3"
			:action="editPostText"
			:placeholder="$t('post.textPlaceholder')"
			:post="post"
			:text="post.text"
			@send="toggleTextEditor"
			@cancel="toggleTextEditor"
		/>
		<slot />
		<Actions :post="post" @toggleComments="toggleComments" />
		<v-list v-if="showComments && post.comments.messages.length" ref="comments-list">
			<Comment
				v-for="comment in post.comments.messages"
				:key="comment.correlationId || comment._id"
				:comment="comment"
			/>
		</v-list>
		<button v-if="showComments" class="show_all_comments">
			{{ $tc('post.viewAllComments', 10) }}
		</button>
		<MessageInput
			v-if="showComments"
			ref="comment-input"
			class="post_comment_input"
			:action="sendComment"
			:placeholder="$t('input.placeholder')"
			:post="post"
			user-link
			@send="scroll"
		/>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Comment from './Comment';
import Actions from './Actions';
import MessageInput from '~/components/MessageInput';
import UserLink from '~/components/UserLink';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { UserStore } from '~/store/user';
import { prefetch } from '~/helpers';

const TAB_BAR_HEIGHT = 50;
const GAP = 5;

const getScroll = (rect, scrollTop) => rect.top + scrollTop - window.innerHeight + rect.height + TAB_BAR_HEIGHT + GAP;

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	name: 'Post',
	components: {
		Comment,
		MessageInput,
		Actions,
		UserLink,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		showComments: false,
		showTextEditor: false,
		editPostText: `${PostStore}/${PostActions.editText}`,
		sendComment: `${PostStore}/${PostActions.sendComment}`,
	}),
	computed: {
		...mapState([
			'me',
		]),
		isTextVisible () {
			return this.post.user.guid === this.me.userId ? !this.showTextEditor : this.post.text;
		},
		isPlaceHolder () {
			return (this.post.user.guid === this.me.userId && !this.post.text);
		},
	},
	methods: {
		scroll () {
			setTimeout(() => {
				if (this.showComments) {
					const { $el } = this;
					const content = $el.closest('.v-content__wrap');
					content.scroll({
						top: getScroll($el.getBoundingClientRect(), content.scrollTop),
						behavior: 'smooth',
					});
				}
			}, 10);
		},
		toggleComments () {
			this.showComments = !this.showComments;
			return prefetch({
				guid: this.post.guid,
				mutation: `${PostStore}/${PostMutations.receiveComments}`,
				store: this.$store,
				type: 'fetchComments',
			}).then((comments) => {
				const { post } = this;
				this.$store.commit(`${PostStore}/${PostMutations.resetComments}`, { comments, post });
				this.scroll();
			});
		},
		toggleTextEditor () {
			if (this.post.user.guid !== this.me.userId) {
				return;
			}
			this.showTextEditor = !this.showTextEditor;
		},
	},
};
</script>

<style lang="stylus" scoped>
.counter-icon
	position relative

.count
	line-height 22px
	font-size .8em
	font-weight 600
	margin-left 3%

.full_post
	margin-top 4%

.card_title
	font-size .75em
	font-weight 500
	margin-bottom 3%

.placeholder
	color #757575

.show_all_comments
	font-size .65em
	font-weight 600
	margin-left 42px
	padding 2%
	padding-left 0

.post_comment_input
	font-size .7em
	position sticky
	bottom 0

.double_heart_button.sqdi-squadded-icon:before
	text-align center
	width 30px
	margin 0
	margin-top 5%
</style>
