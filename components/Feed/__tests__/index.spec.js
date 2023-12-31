import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import FeedComponent from '../index.vue';
import Comments from '~/components/Comments';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { PostStore, PostMutations } from '~/store/post';
import Store from '~/store';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('FeedComponent Empty State', () => {
	const EMPTY_FEED_TEXT = 'empty-feed-text';
	const LOAD_NEW_BUTTON = 'load-new-button';

	let localVue;
	let store;
	let wrapper;

	const $route = {
		name: 'feed',
	};

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
		store.dispatch = jest.fn();
		global.window.addEventListener = jest.fn();
		global.window.removeEventListener = jest.fn();
		document.body.addEventListener = jest.fn();
		document.body.scrollTo = jest.fn();
		document.body.removeEventListener = jest.fn();
		wrapper = shallowMount(FeedComponent, {
			localVue,
			store,
			mocks: {
				$t: msg => msg,
				$route,
			},
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	const propsData = {
		items: [aDefaultSingleItemMsgBuilder().withGUID().get()],
	};

	it('sets the correct default props', () => {
		expect(FeedComponent.props.items).toEqual(jasmine.any(Object));
		expect(wrapper.vm.items).toEqual(jasmine.any(Array));
		expect(wrapper.vm.items.length).toBe(0);
	});

	it('accepts items list as props and do not render message for empty Feed', () => {
		wrapper.setProps(propsData);

		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});

	it('should add listener for scroll on mounted', () => {
		expect(document.body.addEventListener).toHaveBeenCalledWith('scroll', wrapper.vm.onScroll);
		expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', wrapper.vm.savePosition);
	});

	it('should remove listener for scroll on destroyed', () => {
		wrapper.destroy();
		expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', wrapper.vm.savePosition);
		expect(document.body.removeEventListener).toHaveBeenCalledWith('scroll', wrapper.vm.onScroll);
	});

	it('should show loadNew button', () => {
		wrapper.setProps({
			...propsData,
			loadNew: true,
		});
		const loadNewButton = wrapper.ref(LOAD_NEW_BUTTON);
		expect(loadNewButton.exists()).toBe(true);
	});

	it('should emit loadNew event', () => {
		wrapper.setProps({
			...propsData,
			loadNew: true,
		});
		const loadNewButton = wrapper.ref(LOAD_NEW_BUTTON);
		wrapper.vm.$emit = jest.fn();
		loadNewButton.trigger('click');
		expect(wrapper.vm.$emit).toHaveBeenCalled();
	});

	it('should render comments for each post', () => {
		wrapper.setProps({
			...propsData,
		});
		const comments = wrapper.find(Comments);
		expect(comments.exists()).toBe(true);
	});

	it('should scroll to opened post', () => {
		const key = `saved_post_${$route.name}`;
		const openedPostId = propsData.items[0].postId;
		sessionStorage.setItem(key, `post_id_${openedPostId}`);
		global.HTMLElement.prototype.scrollIntoView = jest.fn();
		store.state.squad.widget.open = true;
		wrapper = shallowMount(FeedComponent, {
			localVue,
			store,
			mocks: {
				$t: msg => msg,
				$route,
			},
			propsData,
		});
		const post = wrapper.find(`#post_id_${openedPostId}`);
		expect(post.element.scrollIntoView).toHaveBeenCalledWith(true);
	});

	it('should render UploadDone if image is uploading', () => {
		store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, 'picture');
		expect(wrapper.ref('uploading-done').exists()).toBe(true);
	});

	it('should show violation dialog', () => {
		store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, 'violation');
		expect(wrapper.ref('violation').exists()).toBe(true);
	});
});
