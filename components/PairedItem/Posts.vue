<template>
	<div class="pa-3 paired-tab">
		<v-tabs
			v-if="isPaired"
			v-model="tabs"
			fixed-tabs
			hide-slider
			class="filter-tab"
			@click.native="changeTab"
		>
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
		<v-tabs-items v-model="tabs" touchless :class="{paired_section: isPaired}">
			<v-tab-item class="tab-sec">
				<Feed :items="allPosts" :paired="isPaired" />
			</v-tab-item>
			<v-tab-item class="tab-sec">
				<Feed :items="outfitPosts" :paired="isPaired" />
			</v-tab-item>
			<v-tab-item class="tab-sec">
				<Feed :items="pollPosts" :paired="isPaired" />
			</v-tab-item>
			<v-tab-item class="tab-sec">
				<Feed :items="galleryPosts" :paired="isPaired" />
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
		isPaired: true,
		tabsLab: ['All', 'Outfits', 'Polls', 'Photos'],
	}),
	computed: {
		...mapGetters({
			allPosts: PairedItemGetters.getAllPosts,
			outfitPosts: PairedItemGetters.getOutfitPosts,
			pollPosts: PairedItemGetters.getPollPosts,
			galleryPosts: PairedItemGetters.getGalleryPosts,
		}),
	},
	created() {
		this.$root.$on('postTaped', data => this.postTaped(data));
		this.$root.$on('postBack', data => this.postBack(data));
	},
	methods: {
		postTaped(options) {
			this.isPaired = false;
		},
		postBack(options) {
			this.isPaired = true;
		},
		changeTab() {
			this.$root.$emit('tabChange', this.tabsLab[this.tabs]);
		},
	},
};
</script>

<style lang="stylus" scoped>
.paired_section .tab-sec
	margin 4.61vw 0 0
	height calc(100vh - 440px)
	overflow-y auto
.paired_hide_sec
	padding-top 0 !important
	height calc(100vh - 120px)
	overflow-y auto
	overflow-x hidden
</style>
