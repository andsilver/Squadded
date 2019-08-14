import { mount, shallowMount } from '@vue/test-utils'
import FeedComponent from './index.vue';

// Here are some Jasmine 2.0 tests, though you can
// use any test runner / assertion library combo you prefer
describe('FeedComponent', () => {

	// Inspect the raw component options
	it('has a created hook', () => {
		expect(typeof FeedComponent.created).toBe('function');
	})
	// Evaluate the results of functions in
	// the raw component options
	it('sets the correct default data', () => {
		expect(typeof FeedComponent.data).toBe('function')
		const defaultData = FeedComponent.data();
		expect(defaultData.message).toBe('hello!');
	})
	// Inspect the component instance on mount
	it('correctly sets the message when created', () => {
		const wrapper = mount(FeedComponent);
		// const vm = new Vue(FeedComponent).$mount();
		expect(wrapper.vm.message).toBe('bye!');
	})
	// Mount an instance and inspect the render output
	it('renders the correct message', () => {
		const wrapper = shallowMount(FeedComponent);
		expect(wrapper.vm.$el.textContent).toBe('bye!');
	})
})
