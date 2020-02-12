import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import AcceptSquad from '../Includes/AcceptSquad.vue';
import TestAcceptSquad from '~/test/test-accept-squad.json';
import Store from '~/store';
import { NotificationStore, NotificationMutations } from '~/store/notification';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Notifications AcceptSquad', () => {
	let wrapper;
	let store;
	let localVue;
	let $ws;

	const USER_LINK = 'user-link';
	const MESSAGE = 'message';
	const TIME_STRING = 'time-string';
	const ACCEPT_BTN = 'accept-btn';
	const DENY_BTN = 'deny-btn';
	const ACCEPTED_MARK = 'accepted-mark';
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

		wrapper = shallowMount(AcceptSquad, {
			store,
			localVue,
			propsData: {
				notification: TestAcceptSquad,
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

	it('should accept squad', async () => {
		store.commit = jest.fn();
		const acceptButton = wrapper.ref(ACCEPT_BTN);
		await acceptButton.trigger('click');
		expect($router.push).toHaveBeenCalledWith('/select-username');
		store.state.user.me.nameSelected = true;
		await acceptButton.trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'acceptSquad',
			targetUserId: TestAcceptSquad.user.guid,
		});
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.setAcceptedSquad}`, TestAcceptSquad._id);
		setTimeout(() => expect(wrapper.ref(ACCEPTED_MARK).exists()).toBe(true));
	});
});
