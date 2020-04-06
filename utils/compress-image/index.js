import Vue from 'vue';
import Compress from './compress';
import { prefetch } from '~/helpers';
import { toFile } from '~/utils/toFile';
import { dataURItoBlob } from '~/utils/dataUriToBlob';
import { PostStore, PostMutations } from '~/store/post';

export const compressImage = ({ maxWidth, image, store, quality, dontCompress }) =>
	new Promise((resolve, reject) => {
		const propsData = {};
		maxWidth && (propsData.maxWidth = maxWidth);
		quality && (propsData.quality = quality);
		const Compresser = Vue.extend(Compress);
		const instance = new Compresser({
			propsData,
			data: () => ({
				input: null,
				file: null,
			}),
			methods: {
				async init() {
					if (dontCompress) {
						this.file = image;
						this.saveImage();
					} else {
						const file = await toFile(image, 'file');
						this.$refs.resizer.uploadFile({
							target: {
								files: [file],
							},
						});
					}
				},
				setImage(input) {
					this.input = input;
				},
				completeCompress(e) {
					const { info, dataUrl: image } = this.input;
					this.file = dataURItoBlob(image, info.type);
					this.saveImage();
				},
				async saveImage() {
					const uploadUrl = await prefetch({
						contentType: this.file.type,
						mutation: `${PostStore}/${PostMutations.uploadURL}`,
						store,
						type: 'getUploadUrl',
					});
					const response = await fetch(uploadUrl, {
						method: 'PUT',
						body: this.file,
					});
					if (!response.ok) {
						throw new Error(response.statusText);
					}
					const img = new URL(uploadUrl);
					img.search = '';
					resolve(img.href);
				},
			},
		});
		instance.$mount();
	});
