import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Squadders from './index.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { notifInviteSquad } from '~/test/notifications.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Squadders', () => {
	const COUNT_SQUADDERS = 'count-squadders';
	const PLUS_BTN = 'plus-btn';
	const NEW_REQUESTS = 'new-requests';

	let wrapper;
	let store;
	let user;
	let localVue;

	const initWrapper = () => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		user = userMockBuilder().get();
		store.state.user.me = user;
		wrapper = shallowMount(Squadders, {
			store,
			localVue,
			props: {
				users: [],
			},
			mocks: {
				$t: msg => msg,
			},
		});
		wrapper.setProps({
			users: [],
		});
	};

	const mockSquadders = (lessThan5 = false) => {
		return new Array(lessThan5 ? 4 : 10).fill(userMockBuilder().short());
	};

	beforeEach(() => {
		initWrapper();
	});

	it('should display correct number', () => {
		const squadders = mockSquadders();
		wrapper.setProps({ users: squadders });
		const count = wrapper.ref(COUNT_SQUADDERS);
		expect(count.text()).toBe(`+${squadders.length - 7}`);
		expect(wrapper.ref('plus-btn').exists()).toBe(true);
		expect(wrapper.ref(NEW_REQUESTS).exists()).toBe(false);
	});

	it('should render new requests', () => {
		store.commit(`${NotificationStore}/${NotificationMutations.add}`, notifInviteSquad);
		expect(wrapper.ref(NEW_REQUESTS).exists()).toBe(true);
	});

	it('should display only 5 people when over 5', () => {
		const squadders = mockSquadders();
		wrapper.setProps({ users: squadders });
		const users = wrapper.findAll('.user-avatar-container');
		expect(users.length).toBe(7);
	});

	it('should display correct people when number of users is less than 5', () => {
		const squadders = mockSquadders(true);
		wrapper.setProps({ users: squadders });
		const users = wrapper.findAll('.user-avatar-container');
		expect(users.length).toBe(squadders.length);
	});

	it('should display plus button', () => {
		const squadders = mockSquadders();
		wrapper.setProps({ users: squadders });
		expect(wrapper.ref(PLUS_BTN).exists()).toBe(true);
	});
});
