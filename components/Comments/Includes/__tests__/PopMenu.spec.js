import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PopMenu from '../PopMenu.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import { merchantMockBuilder } from '~/test/merchant.mock';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

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

	const user = userMockBuilder().get();
	const merchant = merchantMockBuilder().get();
	const post = aDefaultSingleItemMsgBuilder().withComment().get();
	const comment = post.comments.messages[0];
	comment._id = comment.id;
	comment.byMe = byMe;

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
			post,
		},
		store,
	});
	wrapper.vm.prompt = jest.fn();

	return { wrapper, ws, comment, user, merchant };
};

describe('PopMenu, author is not Me', () => {
	let wrapper, ws, comment, user, merchant;

	beforeEach(() => {
		({ wrapper, ws, comment, user, merchant } = factory(false));
	});

	it('should display report link', () => {
		expect(wrapper.ref('report-comment').exists()).toBe(true);
	});

	it('report link is clicked, it dispatches popup method', () => {
		wrapper.ref('report-comment').trigger('click');

		expect(wrapper.vm.showReasonDialog).toBe(true);
		expect(wrapper.vm.current).toBe('reportComment');
	});

	it('report method is called, it sends websocket event with correct payload', () => {
		wrapper.vm.reportComment();

		expect(ws.sendObj).toHaveBeenCalledWith({
			type: 'report',
			commentId: comment.id,
			merchantId: merchant.id,
			userId: user.userId,
			reason: null,
			other: null,
		});
	});

	it('should not display delete if author is not me', () => {
		expect(wrapper.ref('delete-comment').exists()).toBe(false);
	});
});

describe('PopMenu, author is Me', () => {
	let wrapper;

	beforeEach(() => {
		({ wrapper } = factory(true));
	});

	it('should not display report link', () => {
		expect(wrapper.ref('report-comment').exists()).toBe(false);
	});

	it('delete link is clicked, it dispatches popup method', () => {
		wrapper.ref('delete-comment').trigger('click');

		expect(wrapper.vm.prompt).toHaveBeenCalled();
		expect(wrapper.vm.current).toBe('deleteComment');
	});

	it('should display delete if author is me', () => {
		expect(wrapper.ref('delete-comment').exists()).toBe(true);
	});
});
