<template>
	<div>
		<h3 class="my-2">
			<v-avatar>
				<img :src="post.user.avatar" :alt="post.user.screenName">
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
				<v-btn icon class="likes" @click="toggleLike">
					<span v-if="post.likes.count" class="count" data-auto-id="likes-count">{{ post.likes.count }}</span>
					<v-icon :color="post.likes.byMe ? 'red' : ''" size="30" data-auto-id="likes-icon">
						mdi-heart{{ post.likes.count ? '' : '-outline' }}
					</v-icon>
				</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script lang="js">
import { FeedStore, FeedActions } from '../../store/feed';

export default {
	name: 'FeedPost',
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	methods: {
		toggleLike () {
			this.$store.dispatch(`${FeedStore}/${FeedActions.toggleLike}`, this.post);
		},
	},
};
</script>

<style lang="stylus" scoped>
.likes
	position relative

	.count
		position absolute
		width 100%
		line-height 30px
		text-align center
		font-size 13px
</style>
