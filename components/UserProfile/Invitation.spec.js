import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Invitation from './Invitation.vue';
import { userMockBuilder } from '~/test/user.mock';
import Store from '~/store';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('User Invitation', () => {
	let wrapper;
	let $ws;
	let user;
	let me;
	let store;
	let localVue;

	const $emit = jest.fn();

	const INVITE_ACTIONS = 'invite-actions';
	const ACCEPT_BUTTON = 'accept-btn';
	const DENY_BUTTON = 'deny-btn';

	beforeEach(() => {
		$ws = {
			sendObj: jest.fn(),
		};
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		user = userMockBuilder().get();
		me = userMockBuilder().get();
		me.nameSelected = true;
		wrapper = shallowMount(Invitation, {
			mocks: {
				$t: msg => msg,
				$ws,
				$emit,
			},
			localVue,
			store,
			propsData: {
				user,
				me,
			},
		});
	});

	it('should render correct contents', () => {
		const inviteActions = wrapper.ref(INVITE_ACTIONS);
		const acceptButton = wrapper.ref(ACCEPT_BUTTON);
		const denyButton = wrapper.ref(DENY_BUTTON);
		expect(inviteActions.exists()).toBe(true);
		expect(acceptButton.exists()).toBe(true);
		expect(denyButton.exists()).toBe(true);
	});

	it('should send acceptSquad message', () => {
		store.commit('SET_SOCKET_AUTH', true);
		const acceptButton = wrapper.ref(ACCEPT_BUTTON);
		acceptButton.trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'acceptSquad',
			targetUserId: user.userId,
		});
	});

	it('should emit remove event', () => {
		store.commit('SET_SOCKET_AUTH', true);
		const denyButton = wrapper.ref(DENY_BUTTON);
		denyButton.trigger('click');
		expect($emit).toHaveBeenCalled();
	});

	it('should send remove squad msg', () => {
		store.commit('SET_SOCKET_AUTH', true);
		wrapper.setProps({
			user: {
				...user,
				squad: {
					exists: true,
				},
			},
		});
		const denyButton = wrapper.ref(DENY_BUTTON);
		denyButton.trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'removeSquadder',
			guid: user.userId,
		});
	});
});
