import { Wrapper, shallowMount } from '@vue/test-utils';
import TagButton from '../TagButton.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Tag Button', () => {
	let wrapper;
	const $emit = jest.fn();

	beforeEach(() => {
		wrapper = shallowMount(TagButton, {
			mocks: {
				$emit,
			},
		});
	});

	it('should display circle button', () => {
		const btn = wrapper.ref('circle-button');
		expect(btn.exists()).toBe(true);
		btn.trigger('click');
		expect($emit).toHaveBeenCalledWith('click');
	});
});
