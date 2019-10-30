import { Chance } from 'chance';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MessageInput from './index.vue';
import Post from '~/components/Post';
import Store from '~/store';
import { PostStore, PostActions } from '~/store/post';

const chance = new Chance();

describe('Message Input', () => {
	let localVue;
	let post;
	let sendComment;
	let store;
	let wrapper;

	const mocks = {
		$t: msg => msg,
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		post = {
			guid: chance.guid(),
		};
		sendComment = `${PostStore}/${PostActions.sendComment}`;
		store = new Vuex.Store(Store);
		store.dispatch = jest.fn();

		wrapper = shallowMount(MessageInput, {
			mocks,
			store,
			localVue,
			parentComponent: Post,
			propsData: {
				post,
				action: sendComment,
			},
		});
	});

	it('should dispatch action set in props', () => {
		const text = chance.sentence();
		wrapper.setData({
			text,
		});

		wrapper.vm.send();
		expect(store.dispatch).toHaveBeenCalledWith(sendComment, { post, text });
	});
});
