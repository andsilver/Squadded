import { Chance } from 'chance';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import squad, { SquadMutations } from './squad';

const chance = new Chance();

describe('Squad Store module', () => {
	let localVue;
	let store;

	beforeEach(() => {
		localStorage.clear();
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(squad);
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
});
