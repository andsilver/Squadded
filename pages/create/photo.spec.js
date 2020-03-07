import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Photo from './photo.vue';
import Store from '~/store';
import { PostStore, PostMutations, PostActions } from '~/store/post';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { prefetch } from '~/helpers';
import { toFile } from '~/utils/toFile';
import { dataURItoBlob } from '~/utils/dataUriToBlob';

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
}));

jest.mock('~/utils/toFile', () => ({
	toFile: jest.fn(),
}));

jest.mock('~/utils/dataUriToBlob', () => ({
	dataURItoBlob: jest.fn(),
}));

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

class URLMock {
	constructor() {
		this.href = 'href';
		this.search = null;
	}
}

describe('Create Photo', () => {
	let wrapper;
	let store;
	let localVue;

	const GOBACK_BAR = 'goback-bar';
	const CAPTURE_PHOTO = 'capture-photo';
	const BROWSE = 'browse';
	const SELECTED_ITEMS = 'selected-items';
	const DONE_BUTTON = 'done-button';
	const GO_BACK_BTN = 'go-back-btn';
	const USER_INPUT = 'user-input';
	const PHOTO_VIEW = 'photo-view';
	const EDIT_BUTTON = 'edit-button';
	const PUBLIC_TOGGLE = 'public-toggle';
	const NEXT_BUTTON = 'next-button';

	const $router = {
		push: jest.fn(),
	};
	const $refs = {
		tagsComponent: {
			coords: [{ id: 'id' }],
		},
		'public-toggle': true,
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		wrapper = shallowMount(Photo, {
			store,
			localVue,
			mocks: {
				$router,
				$t: msg => msg,
				$refs,
			},
		});
	});

	it('should display correct contents', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		const gobackBar = wrapper.ref(GOBACK_BAR);
		const capturePhoto = wrapper.ref(CAPTURE_PHOTO);
		const browse = wrapper.ref(BROWSE);
		const selectedItems = wrapper.ref(SELECTED_ITEMS);
		const doneButton = wrapper.ref(DONE_BUTTON);
		const goBackBtn = wrapper.ref(GO_BACK_BTN);
		const userInput = wrapper.ref(USER_INPUT);
		const photoView = wrapper.ref(PHOTO_VIEW);
		const editButton = wrapper.ref(EDIT_BUTTON);
		const publicToggle = wrapper.ref(PUBLIC_TOGGLE);
		const nextButton = wrapper.ref(NEXT_BUTTON);

		expect(gobackBar.exists()).toBe(true);
		expect(capturePhoto.exists()).toBe(true);
		expect(browse.exists()).toBe(true);
		expect(selectedItems.exists()).toBe(true);
		expect(nextButton.exists()).toBe(true);
		expect(doneButton.exists()).toBe(false);
		expect(goBackBtn.exists()).toBe(true);
		expect(userInput.exists()).toBe(false);
		expect(photoView.exists()).toBe(false);
		expect(editButton.exists()).toBe(false);
		expect(publicToggle.exists()).toBe(false);
	});

	it('should go to next step', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		const post = aDefaultSingleItemMsgBuilder().get();
		post.selected = true;
		store.state.activity.wishlist = [post];
		wrapper.vm.preview({
			image: 'imagedata',
			file: 'file',
		});
		const nextButton = wrapper.ref(NEXT_BUTTON);
		nextButton.trigger('click');
		const photoView = wrapper.ref(PHOTO_VIEW);
		expect(photoView.exists()).toBe(true);
	});

	it('should compress image', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		const post = aDefaultSingleItemMsgBuilder().get();
		const type = 'image';
		const file = {
			type: 'image',
		};
		const image = 'imagedata';

		post.selected = true;
		store.state.activity.wishlist = [post];
		wrapper.setData({ file });
		wrapper.vm.preview({
			image,
			file,
			type,
		});

		const nextButton = wrapper.ref(NEXT_BUTTON);
		nextButton.trigger('click');
		const doneButton = wrapper.ref(DONE_BUTTON);
		const ref = wrapper.ref('resizer');
		ref.vm.uploadFile = jest.fn();
		toFile.mockReturnValue(Promise.resolve(file));
		await doneButton.trigger('click');
		await Promise.resolve();

		expect(toFile).toHaveBeenCalledWith(image, 'file');
		expect(ref.vm.uploadFile).toHaveBeenCalledWith({
			target: {
				files: [file],
			},
		});
	});

	it('should upload image and save post', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		const uploadUrl = 'uploadurl';
		const post = aDefaultSingleItemMsgBuilder().get();
		const type = 'image';
		const file = {
			type: 'image',
		};
		const image = 'imagedata';

		wrapper.setData({ file });
		post.selected = true;
		store.state.activity.wishlist = [post];
		store.dispatch = jest.fn();
		store.commit = jest.fn();
		prefetch.mockReturnValue(uploadUrl);
		global.fetch = jest.fn().mockReturnValue({ ok: true });
		global.URL = URLMock;
		dataURItoBlob.mockReturnValue(file);

		wrapper.vm.preview({
			image,
			file,
			type,
		});

		const info = { type };
		const dataUrl = image;
		const ref = wrapper.ref('resizer');

		ref.vm.$emit('input', { info, dataUrl });
		ref.vm.$emit('onComplete');

		expect(dataURItoBlob).toHaveBeenCalledWith(image, type);
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.setUploadingPicture}`, image);

		expect(prefetch).toHaveBeenCalledWith({
			contentType: 'image',
			mutation: `${PostStore}/${PostMutations.uploadURL}`,
			store,
			type: 'getUploadUrl',
		});

		await Promise.resolve();

		expect(global.fetch).toHaveBeenCalledWith(uploadUrl, {
			method: 'PUT',
			body: file,
		});

		await Promise.resolve();

		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.saveItem}`, {
			img: 'href',
			items: [post.item],
			private: !wrapper.vm.$refs['public-toggle'].isPublic,
			text: wrapper.vm.text,
			type: 'galleryPost',
		});
	});
});
