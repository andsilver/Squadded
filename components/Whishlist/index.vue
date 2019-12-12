<template lang="html">
	<section>
		<Preloader v-if="!wishlist" ref="preloader" class="mt-8" />
		<span v-else-if="!wishlist.length" ref="empty-whishlist-text">{{ $t('wishlist.empty') }}</span>
		<div v-else>
			<WhishlistItem
				v-for="post in wishlist"
				:key="post.item.itemId"
				:post="post"
			/>
		</div>
	</section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import WhishlistItem from './item';
import { prefetch } from '~/helpers';
import Preloader from '~/components/Preloader.vue';
import { ActivityStore, ActivityMutations } from '~/store/activity';

const { mapState } = createNamespacedHelpers(ActivityStore);

export default {
	name: 'Whishlist',
	components: {
		Preloader,
		WhishlistItem,
	},
	computed: {
		...mapState([
			'wishlist',
		]),
	},
	created () {
		this.$store.commit(`${ActivityStore}/${ActivityMutations.clearWishlist}`);
		return prefetch({
			guid: this.$route.params.id,
			store: this.$store,
			type: 'fetchWishlist',
		});
	},
};
</script>
