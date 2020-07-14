import { Wrapper, shallowMount } from '@vue/test-utils';
import Voter from '../Includes/Voter.vue';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Test key event', () => {
	it('should have click on user avatar', () => {
		const voter = { };
		const wrapper = shallowMount(Voter, {
			propsData: {
				voter,
			},
		});
		const getUserLink = jest.fn();
		wrapper.setMethods({ getUserLink });

		const avatarRef = 'voter-avatar';
		expect(wrapper.ref(avatarRef).exists()).toBe(true);
		expect(getUserLink).toBeCalled();
	});
});
