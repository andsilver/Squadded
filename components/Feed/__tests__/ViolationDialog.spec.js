import { Wrapper, shallowMount } from '@vue/test-utils';
import ViolationDialog from '../ViolationDialog';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Violation Dialog', () => {
	let wrapper;

	const TITLE = 'title';
	const CLOSE_BTN = 'close-btn';
	const DESCRIPTION = 'description';
	const OK_BTN = 'ok-btn';

	const $emit = jest.fn();

	beforeEach(() => {
		wrapper = shallowMount(ViolationDialog, {
			mocks: {
				$t: msg => msg,
				$emit,
			},
		});
	});

	it('should render correct content', () => {
		expect(wrapper.ref(TITLE).exists()).toBe(true);
		expect(wrapper.ref(CLOSE_BTN).exists()).toBe(true);
		expect(wrapper.ref(DESCRIPTION).exists()).toBe(true);
		expect(wrapper.ref(OK_BTN).exists()).toBe(true);
	});

	it('should close dialog on clicking StartWatching button', () => {
		wrapper.ref(OK_BTN).trigger('click');
		expect($emit).toHaveBeenCalledWith('close');
	});
});
