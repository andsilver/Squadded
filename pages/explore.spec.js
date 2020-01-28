import { Wrapper, shallowMount } from '@vue/test-utils';
import Explore from './explore.vue';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Explore page', () => {
	const TOP_OUTFITS = 'top-outfits';

	let wrapper;

	beforeEach(() => {
		wrapper = shallowMount(Explore);
	});

	it('should render correct contents', () => {
		const topOutfits = wrapper.ref(TOP_OUTFITS);
		expect(topOutfits.exists()).toBe(true);
	});
});
