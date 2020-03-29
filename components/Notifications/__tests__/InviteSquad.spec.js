import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import InviteSquad from '../Includes/InviteSquad.vue';
import { notifInviteSquad } from '~/test/notifications.mock';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Notifications InviteSquad', () => {
	let wrapper;
	let store;
	let localVue;
	let $ws;
	let user;

	const USER_LINK = 'user-link';
	const MESSAGE = 'message';
	const TIME_STRING = 'time-string';
	const ACCEPT_BTN = 'accept-btn';
	const DENY_BTN = 'deny-btn';
	const $router = {
		push: jest.fn(),
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);

		$ws = {
			sendObj: jest.fn(),
		};

		window.moment = jest.fn().mockReturnValue({
			fromNow: jest.fn(),
		});
		window.moment.locale = jest.fn();
		user = userMockBuilder().get();
		store.state.user.me = user;

		wrapper = shallowMount(InviteSquad, {
			store,
			localVue,
			propsData: {
				notification: notifInviteSquad,
			},
			mocks: {
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
				$ws,
				$router,
			},
		});
	});

	it('should render correct contents', () => {
		const userLink = wrapper.ref(USER_LINK);
		const message = wrapper.ref(MESSAGE);
		const timeString = wrapper.ref(TIME_STRING);
		const acceptButton = wrapper.ref(ACCEPT_BTN);
		const denyButton = wrapper.ref(DENY_BTN);
		expect(userLink.exists()).toBe(true);
		expect(message.exists()).toBe(true);
		expect(timeString.exists()).toBe(true);
		expect(acceptButton.exists()).toBe(true);
		expect(denyButton.exists()).toBe(true);
	});

	it('should accept squad', () => {
		const acceptButton = wrapper.ref(ACCEPT_BTN);
		store.state.user.me.nameSelected = false;
		acceptButton.trigger('click');
		expect($router.push).toHaveBeenCalledWith('/select-username');
		store.state.user.me.nameSelected = true;
		acceptButton.trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'acceptSquad',
			targetUserId: notifInviteSquad.user.guid,
		});
	});
});
