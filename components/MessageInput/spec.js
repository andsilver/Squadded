import { Chance } from 'chance';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Post from '../Feed/Post.vue';
import MessageInput from './index.vue';

const chance = new Chance();

describe('Message Input', () => {
	let localVue;
	let guid;
	let sendComment;
	let actions;
	let store;
	let wrapper;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		guid = chance.guid();
		sendComment = 'sendComment';
		actions = {
			[sendComment]: jest.fn(),
		};
		store = new Vuex.Store({
			actions,
		});

		wrapper = shallowMount(MessageInput, {
			store,
			localVue,
			parentComponent: Post,
			propsData: {
				guid,
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
		expect(actions[sendComment]).toHaveBeenCalled();
		const payload = actions[sendComment].mock.calls[0][1];
		expect(payload).toMatchObject({ guid, text });
	});
});
