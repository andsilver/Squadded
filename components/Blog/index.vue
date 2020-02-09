<template>
	<section>
		<Preloader v-if="!blog" ref="preloader" class="mt-8" />
		<span v-else-if="!blog.length" ref="empty-blog-text">{{ $t('feed.isEmpty') }}</span>
		<Feed :items="blog" @loadMore="fetchBlog" />
	</section>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader.vue';
import { ActivityStore, ActivityActions } from '~/store/activity';

const activityState = createNamespacedHelpers(ActivityStore).mapState;

export default {
	name: 'Blog',
	components: {
		Feed,
		Preloader,
	},
	computed: {
		...activityState([
			'blog',
		]),
		...mapState([
			'socket',
		]),
	},
	created () {
		this.fetchBlog();
	},
	methods: {
		fetchBlog() {
			if (!this.socket.isAuth) {
				return;
			}
			this.$store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
				type: 'blog',
				guid: this.$route.params.id,
			});
		},
	},
};
</script>
