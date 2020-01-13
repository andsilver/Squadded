<template>
	<section class="post_buttons">
		<v-btn class="counter-icon like_button" @click="toggleLike">
			<v-icon
				ref="likes-icon"
				class="buttons_icon"
				:color="post.likes.byMe ? '#FD6256' : '#B8B8BA'"
				size="5.23vw"
			>
				sqdi-favorite-heart-button{{ post.likes.byMe ? '' : '-outline' }}
			</v-icon>
			<span class="action-label" :class="{liked : post.likes.byMe }">{{ $t('Like') }}</span>
		</v-btn>
		<v-btn ref="comments-link" nuxt :to="`/post/${post.postId}/reactions`" class="counter-icon comments_button">
			<v-icon ref="comments-icon" style="color: #B8B8BA;" class="buttons_icon" size="5.23vw">
				sqdi-chat-outlined
			</v-icon>
			<span v-if="commentsCount" ref="comments-count" class="count comments-count">{{ short(commentsCount) }}</span>
			<span class="action-label">{{ $t('Comment') }}</span>
		</v-btn>
		<v-btn class="counter-icon like_count">
			<v-icon
				class="buttons_icon like_icon"
				size="3.38vw"
			>
				sqdi-favorite-heart-button
			</v-icon>
			<nuxt-link :to="`/post/${post.postId}/reactions#likes`" @click="cancelBubble">
				<span v-if="post.likes.count" ref="likes-count" class="count">{{ short(post.likes.count) }}</span>
				<span v-else ref="likes-count" class="count">0</span>
			</nuxt-link>
		</v-btn>
		<v-btn v-if="post.item" class="counter-icon hanger_button">
			<v-icon ref="hanger-icon" style="color: #B8B8BA;" class="buttons_icon" size="22">
				sqdi-hanger
			</v-icon>
			<span v-if="post.item && post.item.outfits" ref="outfits-count" class="count">{{ short(post.item.outfits) }}</span>
		</v-btn>
	</section>
</template>

<script>
import { shortNumber } from '~/helpers';
import { PostStore, PostActions } from '~/store/post';

export default {
	name: 'PostActions',
	props: {
		post: {
			type: Object,
			required: true,
		},
		groupPost: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		commentsCount () {
			return this.post.comments.messages.length || this.post.comments.count;
		},
	},
	methods: {
		short(number) {
			return shortNumber(number, this._i18n.locale);
		},
		cancelBubble (e) {
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			e.cancelBubble = true;
			return false;
		},
		toggleLike () {
			this.$store.dispatch(`${PostStore}/${PostActions.toggleLike}`, this.post);
		},
		toggleComments () {
			this.$emit('toggleComments');
		},
	},
};
</script>

<style lang="stylus" scoped>
.post_buttons
	display block
	position relative
	margin-top 2.46vw
	border-bottom 1px solid #DBDBDB
	overflow hidden
	.counter-icon
		.buttons_icon
			margin-right 2.57vw
			&.like_icon
				margin-right 1.53vw
		.action-label
			color #B8B8BA
			text-transform capitalize
			font-size 3.23vw
			font-weight 600
			letter-spacing 0
			&.liked
				color #FD6256
	.like_button
		margin-left 5.15vw
		width 15.38vw
		margin-right 6.69vw
		min-width auto
	.like_count
		width 10.46vw
		min-width auto
		position absolute
		right 5.15vw
		color #B8B8BA
		.count
			color #B8B8BA
.like_button,
.comments_button,
.like_count,
.hanger_button
	flex-grow 2
	padding 2.61vw 0 !important
	height 100% !important
	box-shadow none !important
	border-radius 0 !important
	background-color transparent !important
.hanger_button, .comments-count
	display none
.grouped-post
	.post_buttons
		border-top 1px solid #DBDBDB
		border-bottom 0
		margin-top 3.93vw
		.counter-icon
			.buttons_icon
				margin-right 0
				&.like_icon
					margin-right 1.53vw
			.action-label
				display none
		.like_button,
		.comments_button,
		.like_count,
		.hanger_button
			padding 3.07vw 0 2% !important
		.like_button
			margin-left 5.15vw
			width 5.23vw
			margin-right 4.61vw
		.comments_button
			width 5.53vw
			min-width auto
		.like_count
			right 3.92vw
</style>
