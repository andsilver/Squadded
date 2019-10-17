<template lang="html">
	<section>
		<Preloader v-if="!posts" ref="preloader" class="mt-8" />
		<span v-else-if="!posts.length" ref="empty-blog-text">{{ $t('feed.isEmpty') }}</span>
		<Post
			v-for="post in blogFeed"
			:key="post.guid"
			:post="post"
		/>
	</section>
</template>

<script lang="js">
import { prefetch } from '~/helpers';
import { UserStore, UserMutations } from '~/store/user';
import { FeedPost } from '~/services/FeedPost';
import Post from '~/components/Post';
import Preloader from '~/components/Preloader.vue';

export default {
	name: 'Blog',
	components: {
		Post,
		Preloader,
	},
	data: () => ({
		posts: null,
	}),
	computed: {
		blogFeed () {
			return this.posts ? this.posts.map(post => new FeedPost(post)) : [];
		},
	},
	mounted () {
		return prefetch({
			guid: this.$route.query.id,
			mutation: `${UserStore}/${UserMutations.setBlog}`,
			store: this.$store,
			type: 'fetchBlog',
		}).then((payload) => {
			this.posts = payload.blog;
		});
	},
};
</script>
