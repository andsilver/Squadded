<template lang="html">
	<section>
		<Preloader v-if="!wishlist" ref="preloader" class="mt-8" />
		<span v-else-if="!wishlist.length" ref="empty-whishlist-text">{{ $t('feed.isEmpty') }}</span>
		<div v-else>
			<WhishlistItem
				v-for="post in wishlist"
				:key="post.guid"
				:post="post"
			/>
		</div>
	</section>
</template>

<script lang="js">
import WhishlistItem from './item';
import { prefetch } from '~/helpers';
import { UserStore, UserMutations } from '~/store/user';
import { FeedPost } from '~/classes/FeedPost';
import Preloader from '~/components/Preloader.vue';

export default {
	name: 'Whishlist',
	components: {
		Preloader,
		WhishlistItem,
	},
	data: () => ({
		wishlist: null,
	}),
	mounted () {
		return prefetch({
			guid: this.$route.params.id,
			mutation: `${UserStore}/${UserMutations.setWishlist}`,
			store: this.$store,
			type: 'fetchWishlist',
		}).then((payload) => {
			this.wishlist = payload.wishlist.map(post => new FeedPost(post));
		});
	},
};
</script>
