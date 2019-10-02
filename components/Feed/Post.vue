<template>
	<div>
		<h3 class="my-2">
			<v-avatar>
				<img :src="post.user && post.user.avatar" :alt="post.user && post.user.screenName">
			</v-avatar>
			{{ post.user.screenName }}
		</h3>
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
					<span v-if="post.comments.length" ref="comments-count" class="count">{{ post.comments.length }}</span>
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
		<v-list v-if="showComments && post.comments.length" ref="comments-list">
			<post-comment
				v-for="comment in post.comments"
				:key="comment.correlationId || comment.id"
				:comment="comment"
			/>
		</v-list>
	</div>
</template>

<script lang="js">
import { FeedStore, FeedActions } from '../../store/feed';
import Comment from './Comment';

export default {
	name: 'FeedPost',
	components: {
		'post-comment': Comment,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		showComments: false,
	}),
	methods: {
		toggleLike () {
			this.$store.dispatch(`${FeedStore}/${FeedActions.toggleLike}`, this.post);
		},
		toggleComments () {
			this.showComments = !this.showComments;
			this.$ws.sendObj({
				type: 'fetchComments',
				guid: this.post.guid,
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
</style>
