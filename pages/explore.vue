<template>
	<v-container class="layout-padding">
		<TopOutfits ref="top-outfits" class="mb-8" />
		<TopGallery ref="top-gallery" />
	</v-container>
</template>

<script>
import TopGallery from '~/components/Explore/TopGallery';
import TopOutfits from '~/components/Explore/TopOutfits';

export default {
	name: 'ExplorePage',
	components: {
		TopOutfits,
		TopGallery,
	},
};
</script>

<style lang="stylus">
.container.layout-padding
	padding 40px 0 0 0
	.layout
		padding 12px
</style>
