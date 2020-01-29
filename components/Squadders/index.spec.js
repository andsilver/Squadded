import { Wrapper, shallowMount } from '@vue/test-utils';
import Squadders from './index.vue';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Squadders', () => {
	const COUNT_SQUADDERS = 'count-squadders';

	let wrapper;

	const initWrapper = () => {
		wrapper = shallowMount(Squadders, {
			props: {
				users: [],
			},
			mocks: {
				$t: msg => msg,
			},
		});
	};

	const mockSquadders = (lessThan5 = false) => {
		return new Array(lessThan5 ? 4 : 10).fill(userMockBuilder().short());
	};

	beforeEach(() => {
		initWrapper();
	});

	it('should display correct number', () => {
		const squadders = mockSquadders();
		wrapper.setProps({ users: squadders });
		const count = wrapper.ref(COUNT_SQUADDERS);
		expect(count.text()).toBe(`+${squadders.length}`);
	});

	it('should display only 5 people when number of users is over 7', () => {
		const squadders = mockSquadders();
		wrapper.setProps({ users: squadders });
		const users = wrapper.findAll('.user-avatar-container');
		expect(users.length).toBe(7);
	});

	it('should display correct people when number of users is less than 5', () => {
		const squadders = mockSquadders(true);
		wrapper.setProps({ users: squadders });
		const users = wrapper.findAll('.user-avatar-container');
		expect(users.length).toBe(squadders.length);
	});
});
