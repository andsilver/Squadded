import { Chance } from 'chance';
import fetchMock from 'fetch-mock';
import jwt from 'jsonwebtoken';
import Vue from 'vue';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { WidgetIPC } from './WidgetIPC';
import { flushPromises } from '~/helpers';
import root from '~/store/index';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';
import { SquadStore, SquadMutations } from '~/store/squad';

describe('Dispatcher', () => {
	let store;
	let ipc;

	beforeEach(() => {
		localStorage.clear();
		store = {
			state: {
				feed: {
					items: [],
				},
			},
			commit: jest.fn(),
			dispatch: jest.fn(),
		};
		ipc = new WidgetIPC(store);
	});

	afterEach(fetchMock.reset);

	it('should dispatch save on receive new Feed item', async () => {
		const msg = {
			type: 'singleItemPost',
			merchantId: 'aMerchantId',
			item: {
				itemId: 'anItemId',
				title: 'aTitle',
				price: 'aPrice',
				origPrice: 'anOrigPrice',
				img: 'anImgUrl',
				url: 'aProductUrl',
			},
		};
		const post = { some: 'post' };

		store.dispatch = jest.fn().mockReturnValue(post);

		ipc.dispatch(msg);
		await flushPromises();

		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.saveItem}`, msg);
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.addItem}`, post);
		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.addPost}`, post);
	});

	it('should commit merchant id', () => {
		const msg = {
			type: 'injectMerchantParams',
			id: 'aMerchantId',
		};

		ipc.dispatch(msg);

		expect(store.commit).toHaveBeenCalledTimes(1);
		expect(store.commit).toHaveBeenCalledWith('SET_MERCHANT_PARAMS', msg);
	});

	it('should commit squad params', () => {
		const msg = {
			type: 'injectSquadParams',
			squad: 'user:someId',
		};

		ipc.dispatch(msg);

		expect(store.commit).toHaveBeenCalledTimes(1);
		expect(store.commit).toHaveBeenCalledWith(`${SquadStore}/${SquadMutations.setSquadParams}`, msg.squad);
	});
});

describe('Login', () => {
	const chance = new Chance();
	const localVue = createLocalVue();
	localVue.use(Vuex);

	it('should connect after login', () => {
		const rootStore = new Vuex.Store(root);
		const ipc = new WidgetIPC(rootStore);
		const userToken = jwt.sign({ sub: chance.guid() }, 'supersecret', { expiresIn: '1h' });

		Vue.prototype.$connect = jest.fn();

		rootStore.state.merchant.id = 'someMerchantId';
		ipc.dispatch({
			type: 'loggedIn',
			userToken,
		});
		expect(Vue.prototype.$connect).toHaveBeenCalledTimes(1);
		expect(localStorage.getItem('userToken')).toBe(userToken);
	});
});
