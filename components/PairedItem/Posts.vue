<template>
	<div ref="itemDetailsSec" class="pa-3 paired-tab">
		<section class="fixed_tabs" :class="{ slide: isScrolled }">
			<h3 class="d-flex justify-space-between align-center pa-2">
				<GoBackBtn ref="go-back-btn" />
				<span class="viewall-title">{{ $t('viewAll') }}</span>
				<v-btn icon>
					<v-icon
						size="6VW"
					>
						sqdi-share
					</v-icon>
				</v-btn>
			</h3>
			<div class="pa-3 pt-1 paired-tab">
				<v-tabs
					v-if="isPaired"
					v-model="tabs"
					fixed-tabs
					hide-slider
					class="filter-tab"
					@click.native="changeTab"
				>
					<v-tab class="tabs bottom-line">
						<span ref="all-tab" style="text-transform: capitalize;">{{ $t('PairedItem.all') }}</span>
					</v-tab>
					<v-tab class="tabs bottom-line">
						<span ref="outfits-tab" style="text-transform: capitalize">{{ $t('PairedItem.outfits') }}</span>
					</v-tab>
					<v-tab class="tabs bottom-line">
						<span ref="polls-tab" style="text-transform: capitalize">{{ $t('PairedItem.polls') }}</span>
					</v-tab>
					<v-tab class="tabs bottom-line">
						<span ref="photos-tab" style="text-transform: capitalize">{{ $t('PairedItem.photos') }}</span>
					</v-tab>
				</v-tabs>
			</div>
		</section>
		<v-tabs
			v-if="isPaired"
			v-model="tabs"
			fixed-tabs
			hide-slider
			class="filter-tab"
			@click.native="changeTab"
		>
			<v-tab class="tabs bottom-line">
				<span ref="all-tab" style="text-transform: capitalize;">{{ $t('PairedItem.all') }}</span>
			</v-tab>
			<v-tab class="tabs bottom-line">
				<span ref="outfits-tab" style="text-transform: capitalize">{{ $t('PairedItem.outfits') }}</span>
			</v-tab>
			<v-tab class="tabs bottom-line">
				<span ref="polls-tab" style="text-transform: capitalize">{{ $t('PairedItem.polls') }}</span>
			</v-tab>
			<v-tab class="tabs bottom-line">
				<span ref="photos-tab" style="text-transform: capitalize">{{ $t('PairedItem.photos') }}</span>
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
import GoBackBtn from '~/components/common/GoBackBtn';
import Feed from '~/components/Feed';
import { PairedItemStore, PairedItemGetters } from '~/store/paired-item';

const { mapGetters } = createNamespacedHelpers(PairedItemStore);

export default {
	components: {
		GoBackBtn,
		Feed,
	},
	data: () => ({
		tabs: 0,
		isPaired: true,
		isScrolled: false,
		tabsLab: ['all', 'outfits', 'polls', 'photos'],
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
	mounted () {
		this.bindScroll();
	},
	methods: {
		bindScroll () {
			window.addEventListener('scroll', this.scrolled.bind(this));
		},
		scrolled (e) {
			// TODO calc actual height to tabs instead const
			const itemSecHight = this.$refs.itemDetailsSec.getBoundingClientRect().top;
			this.isScrolled = !!(itemSecHight < 0);
		},
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
.paired_hide_sec
	padding-top 0 !important
	height calc(100vh - 120px)
	overflow-y auto
	overflow-x hidden
	width 100%
.tabs
	&.bottom-line
		border-bottom 0.46vw solid rgba(184,184,186,0.30)
	&.v-tab--active
		border-color #000
.fixed_tabs
	position fixed
	top -115px
	left 0
	width 100%
	z-index 10
	background-color #fff
	transition-property top
	transition-duration .1s;
	&.slide
		top 0
	h3
		width 100%
.viewall-title
	font-size 4.30vw
.paired_hide_sec::-webkit-scrollbar-thumb
	background-color #B8B8BA
	outline 0
.paired_hide_sec::-webkit-scrollbar
	width 5px
	height auto
</style>
