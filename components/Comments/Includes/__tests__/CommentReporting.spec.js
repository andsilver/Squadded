import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PopMenu from '../PopMenu.vue';
import Store from '~/store';
import { commentMockBuilder } from '~/test/comment.mock';
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

	const comment = commentMockBuilder().withByMe(byMe).get();
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
			comment,
		},
		store,
	});
	wrapper.vm.prompt = jest.fn();

	return { wrapper, ws, comment, user, merchant };
};

describe('CommentReporting', () => {
	let wrapper, ws, comment, user, merchant;

	beforeEach(() => {
		({ wrapper, ws, comment, user, merchant } = factory(false));
	});

	it('report link is clicked, it dispatches popup method', () => {
		wrapper.find('.comment-menu-report').find('v-list-item-title').trigger('click');

		expect(wrapper.vm.prompt).toHaveBeenCalledTimes(1);
		expect(wrapper.vm.current).toBe('reportComment');
	});

	it('report method is called, it sends websocket event with correct payload', () => {
		wrapper.vm.reportComment();

		expect(ws.sendObj).toHaveBeenCalledWith({
			type: 'report',
			commentId: comment.id,
			merchantId: merchant.id,
			userId: user.userId,
		});
	});
});
