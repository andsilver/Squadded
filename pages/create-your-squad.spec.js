import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CreateYourSquad from './create-your-squad.vue';
import { userMockBuilder } from '~/test/user.mock';
import Store from '~/store';
import { UserStore, UserMutations } from '~/store/user';
import { FeedActions, FeedStore } from '~/store/feed';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Create Your Squad', () => {
	let wrapper;
	let store;
	let localVue;

	const $router = {
		push: jest.fn(),
	};
	const me = userMockBuilder().get();

	const CREATE_SQUAD_TEXT = 'create-squad-text';
	const INVITE_BTN = 'invite-btn';
	const SHARE_PROFILE_MODAL = 'share-profile-modal';
	const FEED = 'feed-layout';

	const initLocalVue = (me) => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		if (me) {
			store.state.user.me = me;
		}
		store.dispatch = jest.fn();
		wrapper = shallowMount(CreateYourSquad, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	};

	beforeEach(() => {
		initLocalVue();
	});

	it('should not render if not auth', () => {
		expect(wrapper.ref(CREATE_SQUAD_TEXT).exists()).toBe(false);
	});

	it('should render contents after auth', async () => {
		await store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		await store.commit('SET_SOCKET_AUTH', true);
		expect(wrapper.ref(CREATE_SQUAD_TEXT).exists()).toBe(true);
		expect(wrapper.ref(INVITE_BTN).exists()).toBe(true);
	});

	it('should show share profile modal', async () => {
		await store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		await store.commit('SET_SOCKET_AUTH', true);
		wrapper.ref(INVITE_BTN).trigger('click');
		const shareProfileModal = wrapper.ref(SHARE_PROFILE_MODAL);
		expect(shareProfileModal.exists()).toBe(true);
	});

	it('should render feed when there is my items', () => {
		expect(store.dispatch).toHaveBeenCalledWith(`${FeedStore}/${FeedActions.fetch}`, true);
		store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.items = [aDefaultSingleItemMsgBuilder().get()];
		expect(wrapper.ref(FEED).exists()).toBe(true);
	});
});
