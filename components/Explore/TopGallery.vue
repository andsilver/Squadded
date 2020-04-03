<template>
	<div class="px-0">
		<div ref="top-gallery-title" class="d-flex align-center ma-3 ml-2 mt-0">
			<img class="ml-1" :width="23.6" src="~assets/img/most-popular-explor.svg" alt="">
			<h3 class="ml-3">
				{{ $t('explore_page.top_gallery.title') }}
			</h3>
		</div>
		<div v-if="items && items.length" class="overflow-x-auto top-gallery-post d-flex pb-2">
			<div v-for="({ post }, index) of items" :key="index" @click="goToLandingPost(post)">
				<div
					ref="post-card"
					class="post-card"
					:style="`background-image: url(${post.img})`"
				>
					<p class="look_tag">
						{{ $t('explore_page.top_gallery.trending_look') }}
					</p>
				</div>
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
.px-0
	&:after
		content ''
		border-bottom 1px solid #dbdbdb
		padding-bottom 0
		position absolute
		width 90%
		left 50%
		transform translateX(-50%)
	h3
		font-size 4.92vw
	.top-gallery-post
		padding-bottom 20px !important
.w-78
	width 62.906vw
	margin-right 3.07vw !important
.post-card
	white-space nowrap
	width 59.69vw
	height 100.384vw
	margin-right 12px
	position relative
	height 97.88vw
	background-size cover
	background-position center
	p.look_tag
		font-size 3.84vw
		background rgba(253, 98, 86, 0.7)
		position absolute
		bottom 0
		width 100%
		margin 0
		padding 2.30vw
		text-align center
		color #fff
		font-weight 700
		text-transform uppercase
.overflow-x-auto
	div:first-child
		margin-left 6px
</style>
