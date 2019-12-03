import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PopMenu from '../Includes/PopMenu.vue';
import Store from '~/store';
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

	const localVue = createLocalVue();
	localVue.use(Vuex);
	const store = new Vuex.Store(Store);

	store.state.merchant = merchant;
	store.state.user.me = user;

	const wrapper = shallowMount(PopMenu, {
		mocks: {
			...mocks,
			$ws: ws,
		},
		localVue,
		propsData: {
			post,
		},
		store,
	});
	wrapper.vm.prompt = jest.fn();

	return { wrapper, ws, post, user, merchant };
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
	let wrapper, ws, post, user, merchant;

	beforeEach(() => {
		({ wrapper, ws, post, user, merchant } = factory(false));
	});

	it('report link in burger is displayed', () => {
		expect(wrapper.findAll('.post-menu-report').length).toBe(1);
	});

	it('edit links in burger are NOT displayed', () => {
		expect(wrapper.findAll('.post-menu-edit').length).toBe(0);
	});

	it('report link is clicked, it dispatches popup method', () => {
		wrapper.find('.post-menu-report').find('v-list-item-title').trigger('click');

		expect(wrapper.vm.prompt).toHaveBeenCalledTimes(1);
		expect(wrapper.vm.current).toBe('reportPost');
	});

	it('report method is called, it sends websocket event with correct payload', () => {
		wrapper.vm.reportPost();

		expect(ws.sendObj).toHaveBeenCalledWith({
			type: 'report',
			postId: post.postId,
			merchantId: merchant.id,
			userId: user.userId,
		});
	});
});
