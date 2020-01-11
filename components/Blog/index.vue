<template>
	<section>
		<Preloader v-if="!blog" ref="preloader" class="mt-8" />
		<span v-else-if="!blog.length" ref="empty-blog-text">{{ $t('feed.isEmpty') }}</span>
		<Feed :items="blog" @loadMore="fetchBlog" />
	</section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader.vue';
import { ActivityStore, ActivityActions } from '~/store/activity';

const { mapState } = createNamespacedHelpers(ActivityStore);

export default {
	name: 'Blog',
	components: {
		Feed,
		Preloader,
	},
	computed: {
		...mapState([
			'blog',
		]),
	},
	created () {
		this.fetchBlog();
	},
	methods: {
		fetchBlog() {
			this.$store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
				type: 'blog',
				guid: this.$route.params.id,
			});
		},
	},
};
</script>
