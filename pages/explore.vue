<template>
	<v-container class="layout-padding">
		<TopItems ref="top-items" class="mb-8" />
		<EndingPolls ref="ending-polls" class="mb-8" />
		<TopOutfits ref="top-outfits" class="mb-8" />
		<TopGallery ref="top-gallery" />
	</v-container>
</template>

<script>
import TopItems from '~/components/Explore/TopItems';
import EndingPolls from '~/components/Explore/EndingPolls';
import TopGallery from '~/components/Explore/TopGallery';
import TopOutfits from '~/components/Explore/TopOutfits';

export default {
	name: 'ExplorePage',
	components: {
		TopItems,
		EndingPolls,
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
