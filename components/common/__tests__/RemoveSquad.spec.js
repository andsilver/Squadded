import { Wrapper, shallowMount } from '@vue/test-utils';
import RemoveSquad from '../RemoveSquad.vue';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
}));

describe('RemoveSquad component', () => {
	let wrapper;
	let user;

	const REMOVE_TRIGGER = 'remove-trigger';
	const REMOVING_SQUADDER = 'removing-squadder';
	const SQUADDER_AVATAR = 'squadder-avatar';
	const TITLE = 'title';
	const CLOSE_BTN = 'close-btn';
	const DESCRIPTION = 'description';
	const REMOVE_BTN = 'remove-btn';
	const CANCEL_BTN = 'cancel-btn';
	const $ws = {
		sendObj: jest.fn(),
	};

	function initLocalVue () {
		user = userMockBuilder().get();
		wrapper = shallowMount(RemoveSquad, {
			mocks: {
				$t: msg => msg,
				$ws,
			},
			propsData: {
				user,
			},
		});
	}

	beforeEach(initLocalVue);

	it('should show removing squadder dialog', () => {
		initLocalVue();
		const trigger = wrapper.ref(REMOVE_TRIGGER);
		expect(trigger.exists()).toBe(true);
		trigger.trigger('click');
		expect(wrapper.vm.showSquadderRemoveDialog).toBe(true);
		expect(wrapper.ref(REMOVING_SQUADDER).exists()).toBe(true);
		expect(wrapper.ref(SQUADDER_AVATAR).exists()).toBe(true);
		expect(wrapper.ref(TITLE).exists()).toBe(true);
		expect(wrapper.ref(CLOSE_BTN).exists()).toBe(true);
		expect(wrapper.ref(DESCRIPTION).exists()).toBe(true);
		expect(wrapper.ref(REMOVE_BTN).exists()).toBe(true);
		expect(wrapper.ref(CANCEL_BTN).exists()).toBe(true);
	});

	it('should remove squadder', () => {
		initLocalVue();
		wrapper.ref(REMOVE_TRIGGER).trigger('click');
		wrapper.ref(REMOVE_BTN).trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'removeSquadder',
			guid: user.userId,
		});
	});
});
