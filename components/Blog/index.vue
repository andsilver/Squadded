<template>
	<section>
		<Preloader v-if="!blog" ref="preloader" class="mt-8" />
		<span v-else-if="!blog.length" ref="empty-blog-text">{{ $t('feed.isEmpty') }}</span>
		<Feed :items="blog" />
	</section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { prefetch } from '~/helpers';
import Feed from '~/components/Feed';
import Preloader from '~/components/Preloader.vue';
import { ActivityStore, ActivityMutations } from '~/store/activity';

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
		this.$store.commit(`${ActivityStore}/${ActivityMutations.clearBlog}`);
		prefetch({
			guid: this.$route.params.id,
			store: this.$store,
			type: 'fetchBlog',
		});
	},
};
</script>
