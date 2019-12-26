<template>
	<div class="pa-2">
		<v-tabs v-model="tabs" class="px-1" fixed-tabs centered>
			<v-tab class="tabs pt-3">
				<span ref="all-tab" style="text-transform: capitalize;">All</span>
			</v-tab>
			<v-tab class="tabs pt-3">
				<span ref="outfits-tab" style="text-transform: capitalize">Outfits</span>
			</v-tab>
			<v-tab class="tabs pt-3">
				<span ref="polls-tab" style="text-transform: capitalize">Polls</span>
			</v-tab>
			<v-tab class="tabs pt-3">
				<span ref="photos-tab" style="text-transform: capitalize">Photos</span>
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="tabs">
			<v-tab-item>
				<Feed :items="allPosts" />
			</v-tab-item>
			<v-tab-item>
				<Feed :items="outfitPosts" />
			</v-tab-item>
			<v-tab-item>
				<Feed :items="pollPosts" />
			</v-tab-item>
			<v-tab-item>
				<Feed :items="galleryPosts" />
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
