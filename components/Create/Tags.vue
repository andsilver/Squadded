<template>
	<div class="shift-card photo-create">
		<slot />
		<CardFrame
			ref="tag-card"
			class="multi-item pa-4 mb-4"
			:class="{ shifted }"
			:show-bag="false"
			:style="{
				width: cropActive ? '100%' : 'unset'
			}"
		>
			<ItemImage
				v-if="!cropActive"
				ref="post-main-image"
				:item="post"
				:resquadd="false"
				:contain="true"
				@click.native="toggleShifted"
			>
				<TagButton
					v-for="(coord, index) in coords"
					:key="index"
					class="tag-button"
					:style="{ top: coord.y + '%', left: coord.x + '%' }"
					border-width="7px"
					font-size="10px"
					@click="() => tagClick(coord)"
				/>
			</ItemImage>
			<ImageCrop v-if="cropActive" ref="photo-crop-view" :item="post" @doneCrop="(data) => $emit('doneCrop', data)" />
			<p v-if="!cropActive" class="tip">
				{{ $t('tip.createPhotoTag') }}
			</p>
		</CardFrame>
		<div ref="scroll" class="scroll-items">
			<SelectItems
				ref="select-items"
				class="photo-selected"
				:is-photo="true"
				:max-count="4"
				narrow
				:style="{ 'max-height': maxHeight }"
				:coords="coords"
				@select="select"
			/>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import SelectItems from './SelectItems';
import CardFrame from '~/components/Posts/Includes/CardFrame';
import ImageCrop from '~/components/Posts/Includes/ImageCrop';
import ItemImage from '~/components/Posts/Includes/ItemImage';
import { FeedPost } from '~/classes/FeedPost';
import TagButton from '~/components/Posts/Includes/TagButton';
import { ActivityStore, ActivityGetters } from '~/store/activity';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

export default {
	name: 'MultiItemPost',
	components: {
		CardFrame,
		ItemImage,
		SelectItems,
		ImageCrop,
		TagButton,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
		cropActive: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data: () => ({
		searchText: '',
		fetched: false,
		shifted: false,
		maxHeight: '250px',
		coords: [],
	}),
	computed: {
		...mapGetters([
			ActivityGetters.getSelected,
		]),
	},
	watch: {
		getSelected (value) {
			this.coords = this.coords.filter(c => value.find(s => s.selected && c.id === s.postId));
		},
	},
	methods: {
		toggleShifted (e) {
			if (this.cropActive) {
				return;
			}
			this.maxHeight = `${(this.$refs['tag-card'].$el.offsetHeight - 40)}px`;
			if (this.shifted) {
				this.coords = this.coords.filter(c => c.id);
				this.$store.state.post.coords_set = this.coords;
			} else if (this.getSelected.length < 4 && e) {
				const rect = e.target.getBoundingClientRect();
				const { left, top } = rect;
				this.coords.push({
					x: (e.pageX - window.scrollX - left - 12) / e.target.clientWidth * 100,
					y: (e.pageY - window.scrollY - top - 12) / e.target.clientHeight * 100,
				});
				this.$store.state.post.coords_set = this.coords;
			}
			this.shifted = !this.shifted;
		},
		select(selected, id) {
			const index = this.coords.findIndex(c => c.id === id);
			if (index > -1) {
				this.coords[index].id = null;
			} else if (!this.coords[this.coords.length - 1].id) {
				this.coords[this.coords.length - 1].id = id;
			}
			this.toggleShifted();
		},
		tagClick(coord) {
			this.shifted = true;
			const top = this.$refs['select-items'].tagClick(coord);
			this.$refs.scroll.scrollTo({
				top,
				behavior: 'smooth',
			});
		},
	},
};
</script>

<style lang="stylus" scoped>
.shift-card
	white-space nowrap
	width 100%
	margin-top 4.30vw
.multi-item,
.scroll-items
	display inline-block
	vertical-align top
.multi-item
	min-width calc(100% - 70px)
	transition-property margin-left
	transition-delay .2s
	&.shifted
		margin-left -60%
.scroll-items
	width 65%
	margin-left -4px
	overflow hidden
	padding-top 40px
	position relative
	.v-card
		width 75%
.grid
	grid-template-columns 1fr 1fr
	grid-template-rows 1fr 1fr
	grid-gap 10px
	&.grid-snap-2
		.v-image
			grid-row-end span 2
	&.grid-snap-3
		.v-image:first-child
			grid-row-end span 2
.tip
	color #b8b8ba
	font-size .688em
	font-weight 500
	text-align center
	margin 16px 0 0 0
.scroll-items::before
	background -moz-linear-gradient(top,  rgba(218,217,221,0.3) 0%, rgba(255,255,255,0) 100%)
	background -webkit-linear-gradient(top,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
	background linear-gradient(to bottom,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
	height 4.615vw
	width 100%
	content ''
	left 0
	position absolute
.scroll-items::after
	background -moz-linear-gradient(top,  rgba(255,255,255,0) 0%, rgba(218,217,221,0.3) 100%)
	background -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%)
	background linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%)
	height 4.615vw
	width 100%
	content ''
	left 0
	position absolute
	bottom 0px
.post-main-image
	position relative
.tag-button
	position absolute
</style>
