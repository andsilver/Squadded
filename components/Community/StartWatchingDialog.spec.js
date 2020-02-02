import { Wrapper, shallowMount } from '@vue/test-utils';
import StartWatchingDialog from './StartWatchingDialog.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Community StartWatchingDialog', () => {
	let wrapper;

	const TITLE = 'title';
	const CLOSE_BTN = 'close-btn';
	const DESCRIPTION = 'description';
	const START_WATCHING_BTN = 'start-watching-btn';

	beforeEach(() => {
		wrapper = shallowMount(StartWatchingDialog, {
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should render correct content', () => {
		expect(wrapper.ref(TITLE).exists()).toBe(true);
		expect(wrapper.ref(CLOSE_BTN).exists()).toBe(true);
		expect(wrapper.ref(DESCRIPTION).exists()).toBe(true);
		expect(wrapper.ref(START_WATCHING_BTN).exists()).toBe(true);
	});

	it('should close dialog on clicking StartWatching button', () => {
		wrapper.ref(START_WATCHING_BTN).trigger('click');
		expect(wrapper.vm.show).toBe(false);
	});
});
