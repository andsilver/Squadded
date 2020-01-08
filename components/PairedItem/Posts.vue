<template>
	<div class="pa-3 paired-tab">
		<v-tabs v-model="tabs" fixed-tabs class="filter-tab">
			<v-tab class="tabs">
				<span ref="all-tab" style="text-transform: capitalize;">All</span>
			</v-tab>
			<v-tab class="tabs">
				<span ref="outfits-tab" style="text-transform: capitalize">Outfits</span>
			</v-tab>
			<v-tab class="tabs">
				<span ref="polls-tab" style="text-transform: capitalize">Polls</span>
			</v-tab>
			<v-tab class="tabs">
				<span ref="photos-tab" style="text-transform: capitalize">Photos</span>
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="tabs" class="paired-section">
			<v-tab-item class="tab-sec">
				<Feed :items="allPosts" paired />
			</v-tab-item>
			<v-tab-item class="tab-sec">
				<Feed :items="outfitPosts" paired />
			</v-tab-item>
			<v-tab-item class="tab-sec">
				<Feed :items="pollPosts" paired />
			</v-tab-item>
			<v-tab-item class="tab-sec">
				<Feed :items="galleryPosts" paired />
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import Feed from '~/components/Feed';
import { PairedItemStore, PairedItemGetters } from '~/store/paired-item';

const { mapGetters } = createNamespacedHelpers(PairedItemStore);

export default {
	components: {
		Feed,
	},
	data: () => ({
		tabs: 0,
	}),
	computed: {
		...mapGetters({
			allPosts: PairedItemGetters.getAllPosts,
			outfitPosts: PairedItemGetters.getOutfitPosts,
			pollPosts: PairedItemGetters.getPollPosts,
			galleryPosts: PairedItemGetters.getGalleryPosts,
		}),
	},
};
</script>

<style lang="stylus" scoped>
.paired-section .tab-sec
	margin 4.61vw 0 0
</style>
