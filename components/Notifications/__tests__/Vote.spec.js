import { Wrapper, shallowMount } from '@vue/test-utils';
import NotificationVote from '../Includes/Vote.vue';
import { notifyVote } from '~/test/notifications.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Notification Vote', () => {
	let wrapper;

	const $router = {
		push: jest.fn(),
	};

	const USER_LINK_AVATAR = 'user-link-avatar';
	const USER_LINK_NAME = 'user-link-name';
	const POST_TITLE = 'post-title';
	const TIMESTRING = 'timestring';
	const NOTIFICATION_IMAGE = 'notification-image';

	beforeEach(() => {
		window.moment = jest.fn().mockReturnValue({
			fromNow: jest.fn(),
		});
		window.moment.locale = jest.fn();

		wrapper = shallowMount(NotificationVote, {
			mocks: {
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
				$router,
			},
			propsData: {
				notification: notifyVote,
			},
		});
	});

	it('should render correct contents', () => {
		expect(wrapper.ref(USER_LINK_AVATAR).exists()).toBe(true);
		expect(wrapper.ref(USER_LINK_NAME).exists()).toBe(true);
		expect(wrapper.ref(POST_TITLE).exists()).toBe(true);
		expect(wrapper.ref(TIMESTRING).exists()).toBe(true);
		expect(wrapper.ref(NOTIFICATION_IMAGE).exists()).toBe(true);
	});

	it('should go to post landing page by clicking on post title', () => {
		wrapper.ref(POST_TITLE).trigger('click');
		expect($router.push).toHaveBeenCalledWith(`/post/${notifyVote.guid}`);
	});
});
