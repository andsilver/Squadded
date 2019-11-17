import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import Store from './index';

describe('Root store', () => {
	let localVue;
	let store;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
	});

	it('should set socket open', () => {
		const event = {
			currentTarget: 'websocketInstance',
		};
		store.commit('SOCKET_ONOPEN', event);

		expect(store.state.socket.isConnected).toBe(true);
		expect(store.state.socket._ws).toBe(event.currentTarget);
	});

	it('should set socket', () => {
		const ws = 'websocketInstance';
		store.commit('jSocket', ws);

		expect(store.state.socket.$ws).toBe(ws);
	});

	it('should set socket closed', () => {
		store.commit('SOCKET_ONCLOSE');

		expect(store.state.socket.isConnected).toBe(false);
	});

	it('should set merchant id', () => {
		const id = 'someMerchantId';
		store.commit('SET_MERCHANT_PARAMS', { id });

		expect(store.state.merchant.id).toBe(id);
	});
});
