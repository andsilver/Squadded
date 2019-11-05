import { Chance } from 'chance';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MessageInput from './index.vue';
import Post from '~/components/Posts/Includes/Post';
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
				action: sendComment,
				post,
			},
		});
	});

	it('should accept text prop', () => {
		const text = chance.sentence();

		wrapper = shallowMount(MessageInput, {
			mocks,
			store,
			localVue,
			parentComponent: Post,
			propsData: {
				action: sendComment,
				post,
				text,
			},
		});

		expect(wrapper.vm.textValue).toBe(text);
	});

	it('should dispatch action with text from input', () => {
		const textValue = chance.sentence();
		wrapper.setData({
			textValue,
		});

		wrapper.vm.send();
		expect(store.dispatch).toHaveBeenCalledWith(sendComment, { post, text: textValue });
	});
});
