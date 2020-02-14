<template>
	<div class="px-2">
		<div ref="top-gallery-title" class="d-flex align-center mb-3">
			<img class="ml-1" :width="16" src="~assets/img/trending-icon.png" alt="">
			<h3 class="ml-3">
				{{ $t('explore_page.top_gallery.title') }}
			</h3>
		</div>
		<div v-if="items && items.length" class="overflow-x-auto d-flex pb-2">
			<div v-for="({ post }, index) of items" :key="index" @click="goToLandingPost(post)">
				<div
					ref="post-card"
					class="post-card"
					:style="`background-image: url(${post.img})`"
				/>
			</div>
		</div>
		<div v-else-if="!items || !items.length">
			<span ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
		</div>
	</div>
</template>

<script>
import { ExploreStore, ExploreGetters, ExploreActions } from '~/store/explore';

export default {
	computed: {
		items () {
			return this.$store.getters[`${ExploreStore}/${ExploreGetters.getItems}`]('topGallery');
		},
	},
	created() {
		this.$store.dispatch(`${ExploreStore}/${ExploreActions.fetchItems}`, 'topGallery');
	},
	methods: {
		goToLandingPost(post) {
			this.$router.push(`/post/${post._id}`);
		},
	},
};
</script>

<style lang="stylus" scoped>
.w-78
	width 62.906vw
	margin-right 3.07vw !important
.post-card
	white-space nowrap
	width 68.46vw
	height 100.384vw
	margin-right 12px
	position relative
	height 97.88vw
	background-size cover
	background-position center
</style>
