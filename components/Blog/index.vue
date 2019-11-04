<template>
	<section>
		<Preloader v-if="!blog" ref="preloader" class="mt-8" />
		<span v-else-if="!blog.length" ref="empty-blog-text">{{ $t('feed.isEmpty') }}</span>
		<div v-else>
			<template
				v-for="post in blog"
			>
				<SingleItemPost
					v-if="post.type === 'singleItemPost'"
					:key="post.guid"
					:post="post"
				/>
				<PollPost
					v-else-if="post.type === 'pollPost'"
					:key="post.guid"
					:post="post"
				/>
			</template>
		</div>
	</section>
</template>

<script>
import { prefetch } from '~/helpers';
import { UserStore, UserMutations } from '~/store/user';
import { FeedPost } from '~/classes/FeedPost';
import SingleItemPost from '~/components/Posts/SingleItemPost';
import PollPost from '~/components/Posts/PollPost';
import Preloader from '~/components/Preloader.vue';

export default {
	name: 'Blog',
	components: {
		SingleItemPost,
		PollPost,
		Preloader,
	},
	data: () => ({
		blog: null,
	}),
	created () {
		prefetch({
			guid: this.$route.params.id,
			mutation: `${UserStore}/${UserMutations.setBlog}`,
			store: this.$store,
			type: 'fetchBlog',
		}).then((payload) => {
			this.blog = payload.blog.map(post => new FeedPost(post));
		});
	},
};
</script>
