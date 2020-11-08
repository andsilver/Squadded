<template>
	<section class="post_buttons">
		<v-btn :ripple="false" class="counter-icon like_button" @click="toggleLike">
			<v-icon
				ref="likes-icon"
				class="buttons_icon"
				:color="post.likes.byMe ? '#FD6256' : ''"
				size="6.33vw"
			>
				sqdi-favorite-heart-button{{ post.likes.byMe ? '' : '-outline' }}
			</v-icon>
			<span v-if="post.likes.count" ref="likes-count" class="count" :class="{liked : post.likes.byMe }">{{ short(post.likes.count) }}</span>
		</v-btn>
		<v-btn ref="comments-link" nuxt :to="`/post/${post.postId}/reactions`" class="counter-icon comments_button">
			<v-icon ref="comments-icon" class="buttons_icon" size="6.33vw">
				sqdi-chat-outlined
			</v-icon>
			<span v-if="commentsCount" ref="comments-count" class="count">{{ short(commentsCount) }}</span>
		</v-btn>
		<v-btn class="counter-icon share_button" @click="share">
			<v-icon
				size="6.33vw"
			>
				sqdi-share-arrow
			</v-icon>
		</v-btn>
		<v-btn v-if="post.item" class="counter-icon hanger_button">
			<v-icon ref="hanger-icon" class="buttons_icon" size="22">
				sqdi-hanger
			</v-icon>
			<span v-if="post.item && post.item.outfits" ref="outfits-count" class="count">{{ short(post.item.outfits) }}</span>
		</v-btn>

		<v-dialog v-model="showShare" content-class="share_box">
			<SharePost ref="share-post-modal" :post-link="shortURL" @hideShowShare="hideShare" />
		</v-dialog>
	</section>
</template>

<script>
import SharePost from './SharePost';
import {
	postLink,
	share,
	showShareModal,
	target,
} from './shareMixins';
import { shortNumber } from '~/helpers';
import { PostStore, PostActions } from '~/store/post';
import { GA_ACTIONS } from '~/consts';

export default {
	name: 'PostActions',
	components: {
		SharePost,
	},
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
	data: () => ({
		showShare: false,
		shortURL: '',
	}),
	computed: {
		commentsCount () {
			return this.post.comments.messages.length || this.post.comments.count;
		},
		postLink,
		target,
	},
	methods: {
		short(number) {
			return shortNumber(number, this._i18n.locale);
		},
		toggleLike () {
			this.$store.dispatch(`${PostStore}/${PostActions.toggleLike}`, this.post);
			this.$forceUpdate();
			this.$gaAction(GA_ACTIONS.LIKE);
		},
		toggleComments () {
			this.$emit('toggleComments');
		},
		share,
		showShareModal,
		showModal () {
			this.showShare = true;
		},
		hideShare () {
			this.showShare = false;
		},
	},
};
</script>

<style lang="stylus" scoped>
.post_buttons
	display flex
	position relative
	padding-top 2.46vw
	margin-top 2.46vw
	overflow hidden
	.counter-icon
		.buttons_icon + span
			margin-left 2.57vw
		.count
			font-weight 600
			letter-spacing 0
			height 6.33vw
			&.liked
				color #FD6256
.like_button,
.comments_button,
.hanger_button,
.share_button
	flex-grow 0
	padding 2.46vw !important
	height 100% !important
	box-shadow none !important
	border-radius 0 !important
	background-color transparent !important
	min-width auto !important
.share_button
	margin-left auto
.hanger_button
	display none

.grouped-post
	.post_buttons
		border-top 1px solid #ececec
.grouped-post,
.single-post
	.counter-icon
		.buttons_icon
			margin-right 0
		.action-label
			display none
</style>
