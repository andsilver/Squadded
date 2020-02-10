import { Wrapper, shallowMount } from '@vue/test-utils';
import UploadingDone from '../UploadingDone.vue';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Feed UploadingDone', () => {
	let wrapper;
	const IMAGE = 'image';
	const CHECK_ICON = 'check-icon';
	const DONE_TEXT = 'done-text';

	beforeEach(() => {
		wrapper = shallowMount(UploadingDone, {
			propsData: {
				image: 'url',
			},
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should render correct contents', () => {
		expect(wrapper.ref(IMAGE).exists()).toBe(true);
		expect(wrapper.ref(CHECK_ICON).exists()).toBe(true);
		expect(wrapper.ref(DONE_TEXT).exists()).toBe(true);
	});
});
