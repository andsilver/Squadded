import { Chance } from 'chance';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import squad, { SquadMutations, SquadActions, SquadStore } from './squad';
import Store from './index';

const chance = new Chance();

describe('Squad Store module', () => {
	let localVue;
	let store;
	let root;
	const $ws = { sendObj: jest.fn() };

	beforeEach(() => {
		localStorage.clear();
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(squad);
		root = new Vuex.Store(Store);
		root.state.socket.isConnected = true;
		root.state.merchant.id = 'aDummyMerchantId';
		root.state.socket.$ws = $ws;
	});

	it('should convert params to route', () => {
		const id = chance.guid();
		const squadParam = `user:${id}`;
		store.commit(SquadMutations.setSquadParams, { squad: squadParam });

		expect(store.state.route).toEqual({
			name: 'user-id',
			params: {
				id,
			},
		});
	});

	it('should convert params with suffix to route', () => {
		const id = chance.guid();
		const squadParam = `user:${id}_invite`;
		store.commit(SquadMutations.setSquadParams, { squad: squadParam });

		expect(store.state.route).toEqual({
			name: 'user-id',
			params: {
				id,
			},
			query: {
				invite: true,
			},
		});
	});

	it('should send check message', () => {
		const items = [];
		const totalPrice = 0;

		root.dispatch(`${SquadStore}/${SquadActions.postCheckout}`, { items, totalPrice });
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'checkout',
			items,
			totalPrice,
		});
	});
});
