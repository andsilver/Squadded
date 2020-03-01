import { Wrapper, shallowMount } from '@vue/test-utils';
import SaveConfirmDialog from './SaveConfirmDialog.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('ProfileSettings - SaveConfirmDialog', () => {
	let wrapper;

	const TITLE = 'title';
	const TEXT = 'text';
	const LEAVE_BTN = 'leave-btn';
	const SAVE_BTN = 'save-btn';
	const $emit = jest.fn();

	beforeEach(() => {
		wrapper = shallowMount(SaveConfirmDialog, {
			data: {
				show: true,
			},
			mocks: {
				$t: msg => msg,
				$emit,
			},
		});
	});

	it('should render correct contents', () => {
		const title = wrapper.ref(TITLE);
		const text = wrapper.ref(TEXT);
		const leaveBtn = wrapper.ref(LEAVE_BTN);
		const saveBtn = wrapper.ref(SAVE_BTN);
		expect(title.exists()).toBe(true);
		expect(text.exists()).toBe(true);
		expect(leaveBtn.exists()).toBe(true);
		expect(saveBtn.exists()).toBe(true);
	});

	it('should emit proper events', () => {
		const leaveBtn = wrapper.ref(LEAVE_BTN);
		leaveBtn.trigger('click');
		expect($emit).toHaveBeenCalledWith('leave');
		const saveBtn = wrapper.ref(SAVE_BTN);
		saveBtn.trigger('click');
		expect($emit).toHaveBeenCalledWith('save');
	});
});
