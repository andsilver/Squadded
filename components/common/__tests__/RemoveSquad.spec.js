import { Wrapper, shallowMount } from '@vue/test-utils';
import RemoveSquad from '../RemoveSquad.vue';
import { HomeStore, HomeMutations, HomeActions } from '~/store/home';
import { FeedStore, FeedMutations, FeedActions } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
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
	const $emit = jest.fn();
	const $store = {
		commit: jest.fn(),
		dispatch: jest.fn(),
	};
	const $gaActionPrivate = jest.fn();

	function initLocalVue() {
		user = userMockBuilder().get();
		wrapper = shallowMount(RemoveSquad, {
			mocks: {
				$t: msg => msg,
				$ws,
				$emit,
				$store,
				$gaActionPrivate,
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

	it('should remove squadder', async () => {
		initLocalVue();
		prefetch.mockReturnValue(Promise.resolve());
		wrapper.ref(REMOVE_TRIGGER).trigger('click');
		wrapper.ref(REMOVE_BTN).trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'removeSquadder',
			guid: user.userId,
		});
		expect($emit).toHaveBeenCalledWith('remove');
		expect(prefetch).toHaveBeenCalledWith({
			mutation: `${UserStore}/${UserMutations.setMe}`,
			store: $store,
			type: 'removeSquadder',
			guid: user.userId || user.guid,
		});
		await Promise.resolve();
		expect($store.commit).toHaveBeenCalledWith(`${HomeStore}/${HomeMutations.clear}`);
		expect($store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.clear}`);
		expect($store.dispatch).toHaveBeenCalledWith(`${HomeStore}/${HomeActions.fetch}`);
		expect($store.dispatch).toHaveBeenCalledWith(`${FeedStore}/${FeedActions.fetch}`);
		expect(prefetch).toHaveBeenCalledWith({ type: 'fetchSquadders', store: $store });
	});
});
