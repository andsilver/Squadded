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

	const INVITE_TEXT = 'invite-text';
	const INVITE_ACTIONS = 'invite-actions';
	const ACCEPT_BUTTON = 'accept-btn';
	const DENY_BUTTON = 'deny-btn';

	beforeEach(() => {
		$ws = {
			sendObj: jest.fn(),
		};
		user = userMockBuilder().get();
		wrapper = shallowMount(Invitation, {
			mocks: {
				$t: msg => msg,
				$ws,
			},
			propsData: {
				user,
			},
		});
	});

	it('should render correct contents', () => {
		const inviteText = wrapper.ref(INVITE_TEXT);
		const inviteActions = wrapper.ref(INVITE_ACTIONS);
		const acceptButton = wrapper.ref(ACCEPT_BUTTON);
		const denyButton = wrapper.ref(DENY_BUTTON);
		expect(inviteText.exists()).toBe(true);
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
});
