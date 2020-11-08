import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PopMenu from '../Includes/PopMenu.vue';
import Store from '~/store';
import { PostStore, PostActions } from '~/store/post';
import { regularPostBuilder } from '~/test/post.mock';
import { userMockBuilder } from '~/test/user.mock';
import { merchantMockBuilder } from '~/test/merchant.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

const mocks = {
	$t: msg => msg,
	$tc: msg => msg,
};

const factory = (byMe) => {
	const ws = {
		sendObj: jest.fn(),
	};

	const post = regularPostBuilder()
		.withGUID()
		.withByMe(byMe)
		.get();

	const user = userMockBuilder().get();
	const merchant = merchantMockBuilder().get();
	const $gaActionPrivate = jest.fn();

	const localVue = createLocalVue();
	localVue.use(Vuex);
	const store = new Vuex.Store(Store);

	store.state.merchant = merchant;
	store.state.user.me = user;
	store.dispatch = jest.fn();

	const wrapper = shallowMount(PopMenu, {
		mocks: {
			...mocks,
			$ws: ws,
			$gaActionPrivate,
		},
		localVue,
		propsData: {
			post,
		},
		store,
	});
	wrapper.vm.prompt = jest.fn();

	return { wrapper, ws, post, user, merchant, store };
};

describe('PostReporting, current user IS me', () => {
	let wrapper;

	beforeEach(() => {
		({ wrapper } = factory(true));
	});

	it('edit links in burger are displayed', () => {
		expect(wrapper.findAll('.post-menu-edit').length).toBe(2);
	});

	it('report link in burger is NOT displayed', () => {
		expect(wrapper.findAll('.post-menu-report').length).toBe(0);
	});
});

describe('PostReporting, current user IS NOT me', () => {
	let wrapper, post, store;

	beforeEach(() => {
		({ wrapper, post, store } = factory(false));
	});

	it('report link in burger is displayed', () => {
		expect(wrapper.findAll('.post-menu-report').length).toBe(1);
	});

	it('edit links in burger are NOT displayed', () => {
		expect(wrapper.findAll('.post-menu-edit').length).toBe(0);
	});

	it('report link is clicked, it dispatches popup method', () => {
		wrapper.find('.post-menu-report').find('v-list-item-title').trigger('click');

		expect(wrapper.vm.prompt).toHaveBeenCalledTimes(0);
		expect(wrapper.vm.current).toBe('reportPost');
	});

	it('report method is called, it sends websocket event with correct payload', async () => {
		const reason = 'other';
		const other = 'other reason';
		wrapper.setData({ reason, other });
		await wrapper.vm.reportPost();
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.reportPost}`, { post, other, reason });
	});
});
