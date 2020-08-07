import { Wrapper, shallowMount } from '@vue/test-utils';
import QuestionCard from '../QuestionCard.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Question Card', () => {
	let wrapper;
	const background = 'background';

	beforeEach(() => {
		wrapper = shallowMount(QuestionCard, {
			propsData: {
				background,
			},
		});
		wrapper.vm.$emit = jest.fn();
	});

	it('should display card and style with background', () => {
		const card = wrapper.ref('card');
		setTimeout(() => expect(wrapper.vm.$emit).toHaveBeenCalled());
		expect(card.exists()).toBe(true);
		expect(card.element.style.background).toBe(background);
	});
});
