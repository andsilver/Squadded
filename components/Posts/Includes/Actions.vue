<template>
	<section class="post_buttons">
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
		<v-btn v-if="post.item" class="counter-icon hanger_button">
			<v-icon ref="hanger-icon" style="color: #B8B8BA;" class="buttons_icon" size="22">
				sqdi-hanger
			</v-icon>
			<span v-if="post.item && post.item.outfits" ref="outfits-count" class="count">{{ post.item.outfits }}</span>
		</v-btn>
	</section>
</template>

<script>
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

</style>
