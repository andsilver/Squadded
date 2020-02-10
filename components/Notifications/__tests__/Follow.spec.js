import { Wrapper, shallowMount } from '@vue/test-utils';
import Follow from '../Includes/Follow.vue';
import { notifyFollow } from '~/test/notifications.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Notifications Follow', () => {
	let wrapper;

	const USER_LINK = 'user-link';
	const TIME_STRING = 'time-string';
	const MESSAGE = 'message';

	beforeEach(() => {
		window.moment = jest.fn().mockReturnValue({
			fromNow: jest.fn(),
		});
		window.moment.locale = jest.fn();

		wrapper = shallowMount(Follow, {
			propsData: {
				notification: notifyFollow,
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
		const timeString = wrapper.ref(TIME_STRING);
		const message = wrapper.ref(MESSAGE);
		expect(userLink.exists()).toBe(true);
		expect(timeString.exists()).toBe(true);
		expect(message.exists()).toBe(true);
	});
});
