import { Wrapper, shallowMount } from '@vue/test-utils';
import GoBackBtn from './GoBackBtn.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('GoBackBtn', () => {
	let wrapper;

	beforeEach(() => {
		history.back = jest.fn();
		wrapper = shallowMount(GoBackBtn, {
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should navigate to back on click GoBackBtn', () => {
		const goBackBtn = wrapper.ref('go-back-btn');
		goBackBtn.trigger('click');
		expect(history.back).toHaveBeenCalled();
	});
});
