import { shallowMount } from '@vue/test-utils'
import FeedComponent from './index.vue';

describe('FeedComponent', () => {
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

	it('renders the correct message', () => {
		const wrapper = shallowMount(FeedComponent, {
			mocks,
		});
		expect(wrapper.vm.$el.textContent).toBe('feed.isEmpty');
	});

	it('accepts items props', () => {
		// at least should not throw errors
		shallowMount(FeedComponent, {
			mocks,
			propsData,
		});
	});
});
