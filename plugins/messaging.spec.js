import { Chance } from 'chance';
import fetchMock from 'fetch-mock';
import jwt from 'jsonwebtoken';
import Vue from 'vue';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import messaging, { dispatch } from './messaging';
import { flushPromises } from '~/helpers';
import store from '~/store/index';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';
import { SquadStore, SquadMutations } from '~/store/squad';

describe('Message listener', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should add event listener', () => {
		spyOn(window, 'addEventListener');

		messaging({ store: {} });

		const func = window.addEventListener.calls.argsFor(0)[1];
		expect(window.addEventListener).toHaveBeenCalledTimes(1);
		expect(window.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
		expect(func.name).toBe('parseMessage');
	});
});

describe('Dispatcher', () => {
	let store;

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

		dispatch(store, msg);
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

		dispatch(store, msg);

		expect(store.commit).toHaveBeenCalledTimes(1);
		expect(store.commit).toHaveBeenCalledWith('SET_MERCHANT_PARAMS', msg);
	});

	it('should commit squad params', () => {
		const msg = {
			type: 'injectSquadParams',
			squad: 'user:someId',
		};

		dispatch(store, msg);

		expect(store.commit).toHaveBeenCalledTimes(1);
		expect(store.commit).toHaveBeenCalledWith(`${SquadStore}/${SquadMutations.setSquadParams}`, msg.squad);
	});
});

describe('Login', () => {
	const chance = new Chance();
	const localVue = createLocalVue();
	localVue.use(Vuex);

	it('should connect after login', () => {
		const root = new Vuex.Store(store);
		const userToken = jwt.sign({ sub: chance.guid() }, 'supersecret', { expiresIn: '1h' });

		Vue.prototype.$connect = jest.fn();

		root.state.merchant.id = 'someMerchantId';
		dispatch(root, {
			type: 'loggedIn',
			userToken,
		});
		expect(Vue.prototype.$connect).toHaveBeenCalledTimes(1);
		expect(localStorage.getItem('userToken')).toBe(userToken);
	});
});
