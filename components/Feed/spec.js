import { Wrapper, shallowMount } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../../test/feed.item.mock';
import FeedComponent from './index.vue';

Wrapper.prototype.getByAutoId = function (id) {
	return this.find(`[data-auto-id="${id}"]`);
};

describe('FeedComponent Empty State', () => {
	const mocks = {
		$t: msg => msg,
	};

	const propsData = {
		items: [aDefaultSingleItemMsgBuilder().get()],
	};

	it('sets the correct default props', () => {
		expect(FeedComponent.props.items).toEqual(jasmine.any(Object));
		const wrapper = shallowMount(FeedComponent, {
			mocks,
		});
		expect(wrapper.vm.items).toEqual(jasmine.any(Array));
		expect(wrapper.vm.items.length).toBe(0);
	});

	it('renders the correct message for empty Feed', () => {
		const wrapper = shallowMount(FeedComponent, {
			mocks,
		});
		expect(wrapper.getByAutoId('empty-feed-text').exists()).toBe(true);
		expect(wrapper.getByAutoId('empty-feed-text').text()).toBe('feed.isEmpty');
	});

	it('accepts items list as props and do not render message for empty Feed', () => {
		const wrapper = shallowMount(FeedComponent, {
			mocks,
			propsData,
		});
		expect(wrapper.getByAutoId('empty-feed-text').exists()).toBe(false);
	});
});
