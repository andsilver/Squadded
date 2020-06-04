<template>
	<div>
		<cropper
			classname="cropper"
			:src="item.img"
			:stencil-props="{
				aspectRatio
			}"
			@change="change"
		/>
		<p class="tip">
			{{ $t('tip.crop') }}
		</p>
		<Button ref="save-button" style="width: 60%;" @click.native="cropImage">
			{{ $t('Save') }}
		</Button>
		<Button ref="save-button" :active="false" style="width: 38%;" @click.native="$emit('doneCrop')">
			{{ $t('Cancel') }}
		</Button>
	</div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import Button from '~/components/common/Button';
import { dataURItoBlob } from '~/utils/dataUriToBlob';

export default {
	components: {
		Cropper,
		Button,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		resquadd: {
			type: Boolean,
			default: true,
		},
		isPaired: {
			type: Boolean,
			default: false,
		},
		aspectRatio: {
			type: Number,
			default: 4 / 5,
		},
	},
	data: () => ({
		canvas: null,
	}),
	methods: {
		change(value) {
			this.canvas = value.canvas;
		},
		cropImage() {
			const image = this.canvas.toDataURL();
			const file = dataURItoBlob(image);
			this.item.img = image;
			this.$emit('doneCrop', { image, file });
		},
	},
};
</script>

<style lang="stylus" scoped>
.gallery-card .multi-item .v-image
	height 100.384vw

.photo-create .multi-item .v-image
	height 42vh
.photo-create .photo-view .v-image
	height 60.95vw
.paired_section .poll-item .v-image, .paired_section .outfit-card .v-image
	min-height 101px
.paired_section .gallery-card .multi-item .v-image
	height 65.76vw
.grouped-post .v-image:after
	background-color rgba(255,255,255,0.6)
	content ''
	width 100%
.grouped-post .is_selected .v-image:after
	background-color transparent

.tip
	color #b8b8ba
	font-size .688em
	font-weight 500
	text-align center
	margin 16px 0 16px 0
</style>
