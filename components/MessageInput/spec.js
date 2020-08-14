import { Chance } from 'chance';
import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MessageInput from './index.vue';
import Post from '~/components/Posts/Includes/Post';
import Store from '~/store';
import { PostStore, PostActions } from '~/store/post';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

const chance = new Chance();

describe('Message Input', () => {
	const OPEN_PANEL_BUTTON = 'open-panel-button';
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
		const ref = wrapper.ref('comment-input-box');
		expect(ref.exists()).toBe(true);
		ref.vm.$emit('send', textValue);
		expect(store.dispatch).toHaveBeenCalledWith(sendComment, { post, text: textValue });
	});

	it('should emit update isPanelOpenProps', () => {
		wrapper = shallowMount(MessageInput, {
			mocks,
			store,
			localVue,
			propsData: {
				isPanelOpenProps: false,
			},
		});
		const openpanel = wrapper.ref(OPEN_PANEL_BUTTON);
		wrapper.vm.$emit = jest.fn();
		openpanel.trigger('click');
		expect(wrapper.vm.$emit).toHaveBeenCalledWith('update:isPanelOpenProps', !wrapper.props().isPanelOpenProps);
	});
});
