<template lang="html">
	<section>
		<Preloader v-if="!wishlist && socket.isAuth" ref="preloader" class="mt-8" />
		<div v-else-if="!wishlist || !wishlist.length" ref="empty-whishlist-text" class="mt-3">
			{{ socket.isAuth ? $t('wishlist.empty') : $t('wishlist.disabled_before_signin') }}
		</div>
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
import { createNamespacedHelpers, mapState } from 'vuex';
import WhishlistItem from './item';
import Preloader from '~/components/Preloader.vue';
import { ActivityStore, ActivityActions } from '~/store/activity';

const activityState = createNamespacedHelpers(ActivityStore).mapState;

export default {
	name: 'Whishlist',
	components: {
		Preloader,
		WhishlistItem,
	},
	computed: {
		...activityState([
			'wishlist',
		]),
		...mapState([
			'socket',
		]),
	},
	created () {
		this.fetchWishlist();
	},
	mounted() {
		window.addEventListener('scroll', this.onScroll);
	},
	destroyed() {
		window.removeEventListener('scroll', this.onScroll);
	},
	methods: {
		onScroll (e) {
			const bottomOfWindow = Math.max(
				window.pageYOffset,
				document.documentElement.scrollTop,
				document.body.scrollTop,
			) + window.innerHeight === document.documentElement.offsetHeight;

			if (bottomOfWindow) {
				this.fetchWishlist();
			}
		},
		fetchWishlist() {
			if (!this.socket.isAuth) {
				return;
			}
			this.$store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
				type: 'wishlist',
				guid: this.$route.params.id,
			});
		},
	},
};
</script>
