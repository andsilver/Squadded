import { shallowMount } from '@vue/test-utils'
import FeedComponent from './index.vue';

describe('FeedComponent Empty State', () => {
	const mocks = {
		$t: msg => msg,
	};

	const propsData = {
		items: [{
			name: 'singleItemPost',
			data: {
				title: 'Title',
				price: '9.99$',
				img: 'http://mock/img.png',
				url: 'http://mock/item',
			},
		}],
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
		expect(wrapper.vm.$el.textContent).toBe('feed.isEmpty');
	});

	it('accepts items list as props and do not render message for empty Feed', () => {
		const wrapper = shallowMount(FeedComponent, {
			mocks,
			propsData,
		});
		expect(wrapper.vm.$el.textContent).not.toBe('feed.isEmpty');
	});
});
