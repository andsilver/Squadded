import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import { Chance } from 'chance';
import Vuex from 'vuex';
import Banner from '../Banner.vue';
import Store from '~/store';
import { NotificationStore, NotificationMutations } from '~/store/notification';

const chance = new Chance();

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Notifications Banner', () => {
	let localVue;
	let store;
	let wrapper;

	const N_NOTIFICATIONS = 5;
	const notifications = new Array(N_NOTIFICATIONS).fill({
		_id: chance.guid(),
		type: chance.pickone(['notifComment', 'notifLike', 'notifyPollEnd', 'notifVote']),
		viewed: false,
	});

	function initLocalVue() {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
	}

	beforeEach(() => {
		initLocalVue();

		wrapper = shallowMount(Banner, {
			localVue,
			store,
		});
	});

	it('notifications should be disappeared after specific seconds', async () => {
		jest.useFakeTimers();
		await store.commit(`${NotificationStore}/${NotificationMutations.add}`, notifications[0]);
		let notification = wrapper.find('v-card');
		expect(notification.exists()).toBeTruthy();

		jest.runOnlyPendingTimers();

		notification = wrapper.find('v-card');
		expect(notification.exists()).toBeFalsy();
	});
});
