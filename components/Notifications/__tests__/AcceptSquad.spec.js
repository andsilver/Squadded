import { Wrapper, shallowMount } from '@vue/test-utils';
import AcceptSquad from '../Includes/AcceptSquad.vue';
import TestAcceptSquad from '~/test/test-accept-squad.json';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Notifications AcceptSquad', () => {
	let wrapper;
	const USER_LINK = 'user-link';
	const MESSAGE = 'message';
	const TIME_STRING = 'time-string';

	beforeEach(() => {
		window.moment = jest.fn().mockReturnValue({
			fromNow: jest.fn(),
		});
		window.moment.locale = jest.fn();

		wrapper = shallowMount(AcceptSquad, {
			propsData: {
				notification: TestAcceptSquad,
			},
			mocks: {
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});
	});

	it('should render correct contents', () => {
		const userLink = wrapper.ref(USER_LINK);
		const message = wrapper.ref(MESSAGE);
		const timeString = wrapper.ref(TIME_STRING);
		expect(userLink.exists()).toBe(true);
		expect(message.exists()).toBe(true);
		expect(timeString.exists()).toBe(true);
	});
});
