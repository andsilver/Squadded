<template>
	<div class="white">
		<div class="d-flex align-center crop-title-sec justify-space-between">
			<span class="pa-3" />
			<h5 class="text-center crop-title">
				{{ $t('profile_settings.crop_photo') }}
				<v-btn class="close-icon" icon small @click="$emit('doneCrop')">
					<v-icon size="3.69vw" color="#B8B8BA">
						sqdi-close-cross
					</v-icon>
				</v-btn>
			</h5>
			<span class="pa-3" />
		</div>
		<div style="overflow: hidden" class="croper-body">
			<cropper
				classname="cropper"
				:src="img"
				:stencil-props="{
					aspectRatio: 1/1
				}"
				:stencil-component="CircleStencil"
				@change="change"
			/>
		</div>
		<div class="d-flex crop-buttom-sec">
			<v-btn
				ref="cancel-button"
				class="cancel-button"
				outlined
				depressed
				style="width: 49%; height: 12.30vw; width: 43.5vw;"
				:active="false"
				@click="$emit('doneCrop')"
			>
				{{ $t('Cancel') }}
			</v-btn>
			<Button ref="save-button" style="width: 49%; height: 12.30vw; width: 43.5vw; margin-left: 3.076vw;" @click.native="cropImage">
				<v-icon small>
					mdi-check
				</v-icon>
				<span class="ml-1">
					{{ $t('Save') }}
				</span>
			</Button>
		</div>
	</div>
</template>

<script>
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import Button from '~/components/common/Button';
import { dataURItoBlob } from '~/utils/dataUriToBlob';

export default {
	components: {
		Cropper,
		Button,
	},
	props: {
		img: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		canvas: null,
		CircleStencil,
	}),
	methods: {
		change(value) {
			this.canvas = value.canvas;
		},
		cropImage() {
			const image = this.canvas.toDataURL();
			const file = dataURItoBlob(image);
			this.$emit('doneCrop', { image, file });
		},
	},
};
</script>

<style lang="stylus" scoped>
.cancel-button
	font-size: 0.6em;
	font-weight: 700;
	letter-spacing: 1px;
	border-radius: 10px;
.crop-title
	font-size 4.30vw
	font-weight 700;
.crop-title-sec
	height 19.69vw
	position relative
.close-icon
	position absolute
	right 7.69vw
.crop-buttom-sec
	padding 7.69vw 4.61vw
.croper-body
	padding 0 4.61vw
</style>
