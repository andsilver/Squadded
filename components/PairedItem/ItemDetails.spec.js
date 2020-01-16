import { Wrapper, shallowMount, createLocalVue, createWrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import ItemDetails from './ItemDetails.vue';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
import Store from '~/store';
import { itemBuilder } from '~/test/item.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Paired Item Details', () => {
	let wrapper;
	let store;
	let localVue;

	const ITEM_IMAGE = 'item-image';
	const ITEM_PRICE = 'item-price';
	const BUY_BUTTON = 'buy-button';
	const ITEM_TITLE = 'item-title';
	const SAVE_BUTTON = 'save-button';
	const CREATE_BUTTON = 'create-button';

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		wrapper = shallowMount(ItemDetails, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});
	});

	it('should display content if item exist', () => {
		const item = itemBuilder().get();
		item.squadded = true;
		store.commit(`${PairedItemStore}/${PairedItemMutations.setItem}`, item);
		const itemImage = wrapper.ref(ITEM_IMAGE);
		const itemPrice = wrapper.ref(ITEM_PRICE);
		const buyButton = wrapper.ref(BUY_BUTTON);
		const itemTitle = wrapper.ref(ITEM_TITLE);
		const saveButton = wrapper.ref(SAVE_BUTTON);
		const createButton = wrapper.ref(CREATE_BUTTON);

		expect(itemImage.exists()).toBe(true);
		expect(itemPrice.exists()).toBe(true);
		expect(buyButton.exists()).toBe(true);
		expect(itemTitle.exists()).toBe(true);
		expect(saveButton.exists()).toBe(true);
		expect(createButton.exists()).toBe(true);
	});

	it('should not display content if item not exist', () => {
		const itemImage = wrapper.ref(ITEM_IMAGE);
		const itemPrice = wrapper.ref(ITEM_PRICE);
		const buyButton = wrapper.ref(BUY_BUTTON);
		const itemTitle = wrapper.ref(ITEM_TITLE);
		const saveButton = wrapper.ref(SAVE_BUTTON);
		const createButton = wrapper.ref(CREATE_BUTTON);

		expect(itemImage.exists()).toBe(false);
		expect(itemPrice.exists()).toBe(false);
		expect(buyButton.exists()).toBe(false);
		expect(itemTitle.exists()).toBe(false);
		expect(saveButton.exists()).toBe(false);
		expect(createButton.exists()).toBe(false);
	});

	it('should open create post dialog', async () => {
		const item = itemBuilder().get();
		item.squadded = true;
		store.commit(`${PairedItemStore}/${PairedItemMutations.setItem}`, item);

		const createButton = wrapper.ref(CREATE_BUTTON);

		expect(createButton.exists()).toBe(true);

		createButton.trigger('click');

		const rootWrapper = createWrapper(wrapper.vm.$root);

		await wrapper.vm.$nextTick();

		expect(rootWrapper.emitted().openCreateMenu).toEqual([[]]);
	});
});
