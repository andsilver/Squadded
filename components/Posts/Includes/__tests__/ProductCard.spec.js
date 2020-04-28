import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ProductCard from '../ProductCard.vue';
import Store from '~/store';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { galleryPostBuilder } from '~/test/gallery.post.mock';
import { SquadAPI } from '~/services/SquadAPI';
import { OPENED_POST } from '~/consts/keys';

jest.mock('~/services/SquadAPI', () => ({
	SquadAPI: {
		openProduct: jest.fn(),
	},
}));

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('ProductCard', () => {
	const IMAGE = 'item-image';
	const CARD = 'card-frame';
	let post;
	let wrapper;
	const $emit = jest.fn();

	function initLocalVue () {
		sessionStorage.clear();
		SquadAPI.openProduct.mockClear();
		const localVue = createLocalVue();
		post = aDefaultSingleItemMsgBuilder().withGUID().get();
		localVue.use(Vuex);
		const store = new Vuex.Store(Store);

		wrapper = shallowMount(ProductCard, {
			localVue,
			propsData: {
				item: post.item,
				postId: post.postId,
			},
			mocks: {
				_i18n: {
					locale: 'en',
				},
			},
			store,
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should open product on open event', () => {
		const triggerElements = [IMAGE, CARD];
		expect.assertions(7);

		triggerElements.forEach((el) => {
			const element = wrapper.ref(el);
			expect(element.exists()).toBe(true);
			element.vm.$emit('open');
			expect(SquadAPI.openProduct).toHaveBeenCalledWith(post.item);
			expect(sessionStorage.getItem(OPENED_POST)).toBe(post.postId);
		});
		expect(SquadAPI.openProduct).toHaveBeenCalledTimes(2);
	});

	it('should set price with currency', () => {
		expect(wrapper.ref(CARD).props('price')).toBe(`€${(post.item.price / 100).toLocaleString('en')}`);
	});

	it('should emit shifted event if post is galleryPost', () => {
		const post = galleryPostBuilder().get();
		wrapper.setProps({
			post,
			shifted: false,
		});
		const card = wrapper.ref(CARD);
		wrapper.vm.$emit = $emit;
		card.vm.$emit('open');
		expect($emit).toHaveBeenCalledWith('shift');
	});
});
