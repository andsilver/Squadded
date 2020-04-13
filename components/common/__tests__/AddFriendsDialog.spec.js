import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import AddFriendsDialog from '../AddFriendsDialog.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import { getShortURL } from '~/services/short-url';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

jest.mock('~/services/short-url', () => ({
	getShortURL: jest.fn(),
}));

jest.mock('~/utils/copy', () => ({
	copy: jest.fn(),
}));

describe('AddFriendsDialog', () => {
	let wrapper;
	let store;

	const user = userMockBuilder().get();
	const TITLE = 'title';
	const FIND_FRIENDS = 'find-friends';

	beforeEach(() => {
		const localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.state.user.me = user;
		getShortURL.mockReturnValue(Promise.resolve('shorturl'));

		wrapper = shallowMount(AddFriendsDialog, {
			mocks: {
				$t: msg => msg,
			},
			store,
			localVue,
		});
		wrapper.setProps({ show: true });
	});

	it('should render correct contents', async () => {
		await Promise.resolve();
		expect(wrapper.ref(TITLE).exists()).toBe(true);
		expect(wrapper.ref(FIND_FRIENDS).exists()).toBe(true);
	});
});
