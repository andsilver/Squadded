import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import FeedComponent from '../index.vue';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import Store from '~/store';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('FeedComponent Empty State', () => {
	const EMPTY_FEED_TEXT = 'empty-feed-text';

	let localVue;
	let store;
	let wrapper;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
		store.dispatch = jest.fn();
		wrapper = shallowMount(FeedComponent, {
			localVue,
			store,
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	const propsData = {
		items: [aDefaultSingleItemMsgBuilder().get()],
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
});
