import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import AcceptSquad from '../Includes/AcceptSquad.vue';
import { notifAcceptSquad } from '~/test/notifications.mock';
import Store from '~/store';

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
				notification: notifAcceptSquad,
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
		expect(userLink.exists()).toBe(true);
		expect(message.exists()).toBe(true);
		expect(timeString.exists()).toBe(true);
	});
});
