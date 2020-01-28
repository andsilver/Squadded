<template>
	<v-container class="layout-padding">
		<TopOutfits ref="top-outfits" />
	</v-container>
</template>

<script>
import TopOutfits from '~/components/Explore/TopOutfits';

export default {
	name: 'ExplorePage',
	components: {
		TopOutfits,
	},
};
</script>

<style lang="stylus">
.container.layout-padding
	padding 40px 0 0 0
	.layout
		padding 12px
</style>
