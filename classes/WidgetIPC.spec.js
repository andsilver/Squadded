import { Chance } from 'chance';
import fetchMock from 'fetch-mock';
import jwt from 'jsonwebtoken';
import Vue from 'vue';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { WidgetIPC } from './WidgetIPC';
import { flushPromises } from '~/helpers';
import root from '~/store/index';
import { ActivityStore, ActivityMutations, ActivityActions } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import { HomeStore, HomeMutations } from '~/store/home';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { SquadStore, SquadMutations, SquadActions } from '~/store/squad';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
import { INTERACTED_KEY, USER_TOKEN_KEY } from '~/consts/keys';

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
				socket: {
					isAuth: true,
				},
				merchant: {
					id: 'merchantid',
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
		expect(store.commit).toHaveBeenCalledWith(`${SquadStore}/${SquadMutations.interaction}`);
		expect(localStorage.getItem(INTERACTED_KEY)).toBeTruthy();
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
			state: {
				open: true,
			},
		};

		ipc.dispatch(msg);

		expect(store.commit).toHaveBeenCalledTimes(2);
		expect(store.commit).toHaveBeenCalledWith(`${SquadStore}/${SquadMutations.setSquadParams}`, { squad: msg.squad });
		expect(store.commit).toHaveBeenCalledWith(`${SquadStore}/${SquadMutations.setWidgetState}`, msg.state.open);
	});

	it('should dispatch postCheckout action', () => {
		const msg = {
			type: 'checkout',
			items: [],
			totalPrice: 0,
		};
		ipc.dispatch(msg);

		expect(store.dispatch).toHaveBeenCalledWith(`${SquadStore}/${SquadActions.postCheckout}`, msg);
	});

	it('should commit openPost and widgetState open', () => {
		const postId = 'postid';
		const msg = {
			type: 'openPost',
			postId,
		};

		ipc.dispatch(msg);

		expect(store.commit).toHaveBeenCalledWith(`${SquadStore}/${SquadMutations.openPost}`, postId);
		expect(store.commit).toHaveBeenCalledWith(`${SquadStore}/${SquadMutations.setWidgetState}`, true);
	});

	it('should remove and unwish single item post', () => {
		const itemId = 'itemId';
		const msg = {
			type: 'removeItem',
			itemId,
		};
		ipc.dispatch(msg);

		expect(store.dispatch).toHaveBeenCalledWith(`${ActivityStore}/${ActivityActions.unwish}`, { itemId });
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.unsquadd}`, itemId);
		expect(store.commit).toHaveBeenCalledWith(`${PairedItemStore}/${PairedItemMutations.unsquadd}`, itemId);
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.unsquadd}`, itemId);
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.unsquadd}`, itemId);
		expect(store.commit).toHaveBeenCalledWith(`${HomeStore}/${HomeMutations.unsquadd}`, itemId);
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
		expect(localStorage.getItem(USER_TOKEN_KEY)).toBe(userToken);
	});
});
