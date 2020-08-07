import { Wrapper, shallowMount } from '@vue/test-utils';
import QuestionColorSelect from '../QuestionColorSelect.vue';

Wrapper.prototype.ref = function(id) {
	return this.findComponent({ ref: id });
};

describe('Question Color Select', () => {
	let wrapper;
	const selected = 'black';

	beforeEach(() => {
		wrapper = shallowMount(QuestionColorSelect, {
			propsData: {
				selected,
			},
		});
		wrapper.vm.$emit = jest.fn();
	});

	it('should display correct number of colors', () => {
		const colors = wrapper.findAll({ ref: 'color' });
		expect(colors.length).toBe(wrapper.vm.colors.length);
	});

	it('should select correct color for the selected prop', () => {
		const pane = wrapper.vm.colors.find(c => c.background === selected);
		expect(pane).toEqual(wrapper.vm.pane);
	});

	it('should apply correct style on color card element', () => {
		const colors = wrapper.findAll({ ref: 'color' });
		const index = wrapper.vm.colors.findIndex(c => c.background === selected);
		const selectedColor = colors.at(index);
		expect(selectedColor.element.style.background).toBe(wrapper.vm.colors[index].background);
		expect(selectedColor.element.style.border).toBe(`1.5px solid ${wrapper.vm.colors[index].border}`);
	});

	it('should emit select event on selecting an color card', () => {
		const color = wrapper.findAll({ ref: 'color' }).at(0);
		color.trigger('click');
		const pane = wrapper.vm.colors[0];
		expect(wrapper.vm.$emit).toHaveBeenCalledWith('select', pane);
		expect(wrapper.vm.pane).toEqual(pane);
	});
});
