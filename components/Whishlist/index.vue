<template lang="html">
	<section>
		<Preloader v-if="!posts" ref="preloader" class="mt-8" />
		<span v-else-if="!posts.length" ref="empty-whishlist-text">{{ $t('feed.isEmpty') }}</span>
		<WhishlistItem
			v-for="post in wishlist"
			:key="post.correlationId || post.guid"
			:post="post"
		/>
	</section>
</template>

<script lang="js">
import WhishlistItem from './item';
import { prefetch } from '~/helpers';
import { UserStore, UserMutations } from '~/store/user';
import { FeedPost } from '~/services/FeedPost';
import Preloader from '~/components/Preloader.vue';

export default {
	name: 'Whishlist',
	components: {
		Preloader,
		WhishlistItem,
	},
	data: () => ({
		posts: null,
	}),
	computed: {
		wishlist () {
			return this.posts ? this.posts.map(post => new FeedPost(post)) : [];
		},
	},
	mounted () {
		return prefetch({
			guid: this.$route.query.id,
			mutation: `${UserStore}/${UserMutations.setWishlist}`,
			store: this.$store,
			type: 'fetchWishlist',
		}).then((payload) => {
			this.posts = payload.wishlist;
		});
	},
};
</script>
