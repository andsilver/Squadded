import { shallowMount, Wrapper } from '@vue/test-utils';
import PopMenu from './PopMenu.vue';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('UserProfile - PopMenu', () => {
	let wrapper;
	let user;

	const $ws = {
		sendObj: jest.fn(),
	};
	const $store = {
		state: {
			merchant: {
				siteUrl: 'siteUrl',
				siteTitle: 'siteTitle',
			},
			squad: {
				API_ENDPOINT: 'apiendpoint',
			},
		},
	};

	beforeEach(() => {
		user = userMockBuilder().get();
		wrapper = shallowMount(PopMenu, {
			mocks: {
				$t: msg => msg,
				$ws,
				$store,
			},
			propsData: {
				user,
			},
		});
	});

	it('should render correct elements', () => {
		user = userMockBuilder().get();
		user.squad = {
			exists: false,
			pending: false,
			invitee: false,
		};
		user.followers.me = false;
		wrapper.setProps({
			user,
		});
		expect(wrapper.ref('report').exists()).toBe(true);
		expect(wrapper.ref('add-to-squad').exists()).toBe(true);
		expect(wrapper.ref('remove-squad').exists()).toBe(false);
		expect(wrapper.ref('unwatch').exists()).toBe(false);
		expect(wrapper.ref('watch').exists()).toBe(true);
		expect(wrapper.ref('share').exists()).toBe(true);
		expect(wrapper.ref('follow').exists()).toBe(true);
		expect(wrapper.ref('remove').exists()).toBe(true);
	});

	it('should not render add-to-squad if he is my squad', () => {
		user = userMockBuilder().get();
		user.squad = {
			exists: true,
			pending: false,
			invitee: false,
		};
		wrapper.setProps({
			user,
		});
		expect(wrapper.ref('add-to-squad').exists()).toBe(false);
		expect(wrapper.ref('remove-squad').exists()).toBe(true);
	});

	it('should render unwatch if he is not my squad and i am not following him', () => {
		user = userMockBuilder().get();
		user.squad = {
			exists: false,
			pending: false,
			invitee: false,
		};
		user.followers.me = true;
		wrapper.setProps({
			user,
		});
		expect(wrapper.ref('watch').exists()).toBe(false);
		expect(wrapper.ref('unwatch').exists()).toBe(true);
	});
});
