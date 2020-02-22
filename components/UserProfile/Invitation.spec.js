import { Wrapper, shallowMount } from '@vue/test-utils';
import Invitation from './Invitation.vue';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('User Invitation', () => {
	let wrapper;
	let $ws;
	let user;
	let me;

	const $emit = jest.fn();

	const INVITE_ACTIONS = 'invite-actions';
	const ACCEPT_BUTTON = 'accept-btn';
	const DENY_BUTTON = 'deny-btn';

	beforeEach(() => {
		$ws = {
			sendObj: jest.fn(),
		};
		user = userMockBuilder().get();
		me = userMockBuilder().get();
		me.nameSelected = true;
		wrapper = shallowMount(Invitation, {
			mocks: {
				$t: msg => msg,
				$ws,
				$emit,
			},
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
		const acceptButton = wrapper.ref(ACCEPT_BUTTON);
		acceptButton.trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'acceptSquad',
			targetUserId: user.userId,
		});
	});

	it('should emit remove event', () => {
		const denyButton = wrapper.ref(DENY_BUTTON);
		denyButton.trigger('click');
		expect($emit).toHaveBeenCalled();
	});

	it('should send remove squad msg', () => {
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
