<template>
	<div>
		<UserLink ref="user-link" :user="post.user" />
		<v-card
			class="mx-auto mb-6"
			:loading="!post.guid && !post.error"
			:elevation="1"
		>
			<v-img
				class="white--text"
				height="200px"
				:src="post.item.img"
			>
				<v-card-title class="align-end fill-height">
					{{ post.item.title }}
				</v-card-title>
			</v-img>

			<v-card-actions>
				<v-card-text>{{ post.item.price }}</v-card-text>
				<v-btn icon class="counter-icon" @click="toggleComments">
					<span v-if="commentsCount" ref="comments-count" class="count">{{ commentsCount }}</span>
					<v-icon ref="comments-icon" size="30">
						mdi-chat-outline
					</v-icon>
				</v-btn>
				<v-btn icon class="counter-icon" @click="toggleLike">
					<span v-if="post.likes.count" ref="likes-count" class="count">{{ post.likes.count }}</span>
					<v-icon ref="likes-icon" :color="post.likes.byMe ? 'red' : ''" size="30">
						mdi-heart{{ post.likes.count ? '' : '-outline' }}
					</v-icon>
				</v-btn>
			</v-card-actions>
		</v-card>
		<v-list v-if="showComments && post.comments.messages.length" ref="comments-list">
			<Comment
				v-for="comment in post.comments.messages"
				:key="comment.correlationId || comment._id"
				:comment="comment"
			/>
		</v-list>
		<MessageInput
			v-if="showComments"
			ref="comment-input"
			:action="action"
			:post="post"
		/>
	</div>
</template>

<script lang="js">
import MessageInput from '../MessageInput';
import Comment from './Comment';
import UserLink from '~/components/UserLink';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { FeedPost } from '~/services/FeedPost';
import { prefetch } from '~/helpers';

const TAB_BAR_HEIGHT = 50;
const GAP = 5;

const getScroll = (rect, scrollTop) => rect.top + scrollTop - window.innerHeight + rect.height + TAB_BAR_HEIGHT + GAP;

export default {
	name: 'FeedPost',
	components: {
		Comment,
		MessageInput,
		UserLink,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
	data: () => ({
		showComments: false,
		action: `${PostStore}/${PostActions.sendComment}`,
	}),
	computed: {
		commentsCount() {
			return this.post.comments.messages.length || this.post.comments.count;
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
	},
};
</script>

<style lang="stylus" scoped>
.counter-icon
	position relative

	.count
		position absolute
		width 100%
		line-height 30px
		text-align center
		font-size 13px

.v-input
	position sticky
	bottom 0
	background white
</style>
