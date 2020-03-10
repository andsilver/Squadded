<template>
	<div class="white pa-3">
		<div class="pt-2 pb-4 d-flex align-center justify-space-between">
			<span class="pa-3" />
			<h5 class="text-center">
				{{ $t('profile_settings.crop_photo') }}
			</h5>
			<v-btn icon small @click="$emit('doneCrop')">
				<v-icon small>
					mdi-close
				</v-icon>
			</v-btn>
		</div>
		<div style="overflow: hidden">
			<cropper
				classname="cropper"
				:src="img"
				:stencil-props="{
					aspectRatio: 10/12
				}"
				@change="change"
			/>
		</div>
		<div class="d-flex py-3 mt-3">
			<v-btn
				ref="cancel-button"
				class="cancel-button"
				outlined
				depressed
				style="width: 49%"
				:active="false"
				@click="$emit('doneCrop')"
			>
				{{ $t('Cancel') }}
			</v-btn>
			<Button ref="save-button" style="width: 49%" @click.native="cropImage">
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
import { Cropper } from 'vue-advanced-cropper';
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
</style>
