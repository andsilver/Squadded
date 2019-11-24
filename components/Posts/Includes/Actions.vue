<template>
	<section class="post_buttons">
		<v-btn class="counter-icon like_button" @click="toggleLike">
			<v-icon
				ref="likes-icon"
				class="buttons_icon"
				:color="post.likes.byMe ? 'red' : '#B8B8BA'"
				size="22"
			>
				sqdi-favorite-heart-button{{ post.likes.count ? '' : '-outline' }}
			</v-icon>
			<nuxt-link :to="`/post/${post.postId}/reactions#likes`" @click="cancelBubble">
				<span v-if="post.likes.count" ref="likes-count" class="count">{{ short(post.likes.count) }}</span>
			</nuxt-link>
		</v-btn>
		<v-btn ref="comments-link" nuxt :to="`/post/${post.postId}/reactions`" class="counter-icon comments_button">
			<v-icon ref="comments-icon" style="color: #B8B8BA;" class="buttons_icon" size="22">
				sqdi-chat-message-oval-outlined-speech-bubble
			</v-icon>
			<span v-if="commentsCount" ref="comments-count" class="count">{{ short(commentsCount) }}</span>
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

.count
	margin-left 5px
</style>
