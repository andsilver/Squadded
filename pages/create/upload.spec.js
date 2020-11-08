import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Upload from './upload.vue';
import Store from '~/store';
import { PostStore, PostMutations, PostActions } from '~/store/post';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { userMockBuilder } from '~/test/user.mock';
import { compressImage } from '~/utils/compress-image';

jest.mock('~/utils/compress-image', () => ({
	compressImage: jest.fn(),
}));

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Create Upload', () => {
	let wrapper;
	let store;
	let localVue;
	const user = userMockBuilder().get();
	const GOBACK_BAR = 'goback-bar';
	// const CAPTURE_PHOTO = 'capture-photo';
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
		store.state.user.me = user;
		global.require = jest.fn();
		wrapper = shallowMount(Upload, {
			store,
			localVue,
			mocks: {
				$router,
				$t: msg => msg,
				$refs,
				$gaAction: jest.fn(),
			},
		});
	});

	it('should display correct contents', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		const gobackBar = wrapper.ref(GOBACK_BAR);
		// const capturePhoto = wrapper.ref(CAPTURE_PHOTO);
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
		// expect(capturePhoto.exists()).toBe(true);
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

	it('should upload image and save post', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		const post = aDefaultSingleItemMsgBuilder().get();
		const type = 'image';
		const file = {
			type: 'image',
			size: 1024 * 1024,
		};
		const image = 'imagedata';

		wrapper.setData({ file });
		post.selected = true;
		store.state.activity.wishlist = [post];
		store.dispatch = jest.fn();
		store.commit = jest.fn();

		wrapper.vm.preview({
			image,
			file,
			type,
		});
		compressImage.mockReturnValue(Promise.resolve(image));
		wrapper.vm.create();

		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.setUploadingPicture}`, image);

		await Promise.resolve();

		expect(compressImage).toHaveBeenCalledWith({ maxWidth: 500, image, store, dontCompress: false });
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.saveItem}`, {
			img: image,
			items: [post.item],
			private: !wrapper.vm.$refs['public-toggle'].isPublic,
			text: wrapper.vm.text,
			type: 'galleryPost',
		});
	});
});
