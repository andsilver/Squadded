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
		<section
			class="post_buttons"
		>
			<v-btn class="counter-icon like_button" @click="toggleLike">
				<v-icon ref="likes-icon" class="buttons_icon" :color="post.likes.byMe ? 'red' : '#B8B8BA'" size="22">
					sqdi-favorite-heart-button{{ post.likes.count ? '' : '-outline' }}
				</v-icon>
				<span v-if="post.likes.count" ref="likes-count" class="count">{{ post.likes.count }}</span>
			</v-btn>
			<v-btn class="counter-icon comments_button" @click="toggleComments">
				<v-icon ref="comments-icon" style="color: #B8B8BA;" class="buttons_icon" size="22">
					sqdi-chat-message-oval-outlined-speech-bubble
				</v-icon>
				<span v-if="commentsCount" ref="comments-count" class="count">{{ commentsCount }}</span>
			</v-btn>
			<v-btn class="counter-icon hanger_button">
				<v-icon ref="hanger-icon" style="color: #B8B8BA;" class="buttons_icon" size="22">
					sqdi-hanger
				</v-icon>
				<span class="count">56</span>
			</v-btn>
		</section>
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
		commentsCount () {
			return this.post.comments.messages.length || this.post.comments.count;
		},
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
		toggleLike () {
			this.$store.dispatch(`${PostStore}/${PostActions.toggleLike}`, this.post);
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
	position relative

.card_title
	font-size .75em
	font-weight 500
	margin-bottom 3%

.placeholder
	color #757575

.post_buttons
	display flex
	border-radius 10px
	border 1px solid #DBDBDB
	overflow hidden

.like_button,
.comments_button,
.hanger_button
	flex-grow 2
	padding 2% 0 !important
	height 100% !important
	box-shadow none !important
	border-radius 0 !important
	background-color transparent !important

.comments_button
	border-left 1px solid #DBDBDB
	border-right 1px solid #DBDBDB

.buttons_icon
	background-color transparent

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
