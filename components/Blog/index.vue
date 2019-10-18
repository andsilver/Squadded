<template lang="html">
	<section>
		<Preloader v-if="!blog" ref="preloader" class="mt-8" />
		<span v-else-if="!blog.length" ref="empty-blog-text">{{ $t('feed.isEmpty') }}</span>
		<div v-else>
			<Post
				v-for="post in blog"
				:key="post.guid"
				:post="post"
			/>
		</div>
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
		blog: null,
	}),
	mounted () {
		return prefetch({
			guid: this.$route.query.id,
			mutation: `${UserStore}/${UserMutations.setBlog}`,
			store: this.$store,
			type: 'fetchBlog',
		}).then((payload) => {
			this.blog = payload.blog.map(post => new FeedPost(post));
		});
	},
};
</script>
