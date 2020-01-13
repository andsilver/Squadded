import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import HesitatingUsers from './HesitatingUsers.vue';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('HesitatingUsers', () => {
	const HESITATING_PEOPLE_TITLE = 'hesitating-people-title';
	const COUNT_HESITATING_PEOPLE = 'count-hesitating-people';

	let localVue;
	let store;
	let wrapper;

	const initWrapper = () => {
		wrapper = shallowMount(HesitatingUsers, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
			},
		});
	};

	const mockHesitatingPeople = (lessThan5 = false) => {
		return new Array(lessThan5 ? 4 : 10).fill(userMockBuilder().short());
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		initWrapper();
	});

	it('should display content', () => {
		const hesitatingPeopleTitle = wrapper.ref(HESITATING_PEOPLE_TITLE);
		// const hesitatingPeopleCount = wrapper.ref(COUNT_HESITATING_PEOPLE);
		expect(hesitatingPeopleTitle.exists()).toBeTruthy();
		// expect(hesitatingPeopleCount.exists()).toBeTruthy();
	});

	it('should display correct number', () => {
		const hesitatingUsers = mockHesitatingPeople();
		store.commit(`${PairedItemStore}/${PairedItemMutations.setHesitatingUsers}`, hesitatingUsers);
		const hesitatingPeopleCount = wrapper.ref(COUNT_HESITATING_PEOPLE);
		expect(hesitatingPeopleCount.text()).toBe(`+${hesitatingUsers.length}`);
	});

	it('should display only 5 people when number of users is over 7', () => {
		const hesitatingUsers = mockHesitatingPeople();
		store.commit(`${PairedItemStore}/${PairedItemMutations.setHesitatingUsers}`, hesitatingUsers);
		const users = wrapper.findAll('.user-avatar-container');
		expect(users.length).toBe(7);
	});

	it('should display correct people when number of users is less than 5', () => {
		const hesitatingUsers = mockHesitatingPeople(true);
		store.commit(`${PairedItemStore}/${PairedItemMutations.setHesitatingUsers}`, hesitatingUsers);
		const users = wrapper.findAll('.user-avatar-container');
		expect(users.length).toBe(hesitatingUsers.length);
	});
});
