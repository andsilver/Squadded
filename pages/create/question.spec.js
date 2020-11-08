import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Question from './question.vue';
import Store from '~/store';
import { PostStore, PostActions } from '~/store/post';
import { FeedStore, FeedMutations } from '~/store/feed';
import { userMockBuilder } from '~/test/user.mock';
import { GA_ACTIONS } from '~/consts';

jest.mock('~/utils/compress-image', () => ({
	compressImage: jest.fn(),
}));

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Create Question', () => {
	let wrapper;
	let store;
	let localVue;
	const user = userMockBuilder().get();
	const GOBACK_BUTTON = 'goback-button';
	const TABS = 'tabs';
	const DONE_BUTTON = 'done-button';
	const USERLINK = 'userlink';
	const QUESTION_CARD = 'question-card';
	const QUESTION_INPUT = 'question-input';
	const COLOR_SELECT = 'color-select';
	const PUBLIC_TOGGLE = 'public-toggle';

	const $router = {
		push: jest.fn(),
	};
	const $refs = {
		'public-toggle': {
			isPublic: true,
		},
	};
	const $gaAction = jest.fn();

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.state.user.me = user;
		global.require = jest.fn();
		wrapper = shallowMount(Question, {
			store,
			localVue,
			mocks: {
				$router,
				$t: msg => msg,
				$refs,
				$gaAction,
			},
		});
	});

	it('should display correct contents', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		const goBackButton = wrapper.ref(GOBACK_BUTTON);
		const doneButton = wrapper.ref(DONE_BUTTON);
		const publicToggle = wrapper.ref(PUBLIC_TOGGLE);
		const tabs = wrapper.ref(TABS);
		const userlink = wrapper.ref(USERLINK);
		const questionCard = wrapper.ref(QUESTION_CARD);
		const questionInput = wrapper.ref(QUESTION_INPUT);
		const colorSelect = wrapper.ref(COLOR_SELECT);

		expect(goBackButton.exists()).toBe(true);
		expect(tabs.exists()).toBe(true);
		expect(userlink.exists()).toBe(true);
		expect(doneButton.exists()).toBe(true);
		expect(questionCard.exists()).toBe(true);
		expect(questionInput.exists()).toBe(true);
		expect(colorSelect.exists()).toBe(true);
		expect(publicToggle.exists()).toBe(true);
	});

	it('should have correct props', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		const userlink = wrapper.ref(USERLINK);
		expect(userlink.props('user')).toEqual(user);

		const questionCard = wrapper.ref(QUESTION_CARD);
		expect(questionCard.props('background')).toBe(wrapper.vm.pane.background);

		const doneButton = wrapper.ref(DONE_BUTTON);
		expect(doneButton.props('disabled')).toBe(true);

		const questionInput = wrapper.ref(QUESTION_INPUT);
		expect(questionInput.element.style.color).toBe(wrapper.vm.pane.color);
		expect(questionInput.classes()).toContain('white-placeholder');
	});

	it('should create a question post', async () => {
		wrapper.vm.text = 'text';
		await store.commit('SET_SOCKET_AUTH', true);
		const questionInput = wrapper.ref(QUESTION_INPUT);
		expect(questionInput.element.value).toBe('text');

		const post = { type: 'questionPost' };

		store.dispatch = jest.fn().mockReturnValue(Promise.resolve(post));
		store.commit = jest.fn();

		const doneButton = wrapper.ref(DONE_BUTTON);
		doneButton.trigger('click');

		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.saveItem}`, {
			private: true,
			text: 'text',
			background: wrapper.vm.pane.background,
			color: wrapper.vm.pane.color,
			type: 'questionPost',
		});

		await Promise.resolve();

		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.addItem}`, post);
		expect($router.push).toHaveBeenCalledWith('/feed');
		expect($gaAction).toHaveBeenCalledWith(GA_ACTIONS.CREATE_POST_QUESTION);
	});
});
