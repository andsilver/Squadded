import { Chance } from 'chance';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import { mutations, actions } from './feed';

const chance = new Chance();

describe('Feed store module', () => {
	describe('mutations', () => {
		const {
			setItems,
			addItem,
			itemLoaded,
		} = mutations;

		it('should set all items in store', () => {
			const state = {
				items: [],
			};

			const length = Math.floor(Math.random() * 100 + 1);
			const newItems = Array(length);

			setItems(state, newItems);
			expect(state.items).toBe(newItems);
			expect(state.items.length).toBe(length);
		});

		it('should push new item to existing list', () => {
			const state = {
				items: [],
			};

			const newItem = aDefaultSingleItemMsgBuilder()
				.withCorrelationId(chance.string())
				.get();
			addItem(state, newItem);
			expect(state.items.length).toBe(1);
			expect(state.items[state.items.length - 1]).toBe(newItem);
		});

		it('should update item guid and ts on load', () => {
			const pendingItem = aDefaultSingleItemMsgBuilder()
				.withCorrelationId(chance.guid())
				.get();

			const state = {
				items: [pendingItem],
			};

			const loadedItem = Object.assign({}, pendingItem, { guid: chance.guid(), ts: Date.now() });
			itemLoaded(state, loadedItem);
			expect(state.items.length).toBe(1);
			expect(pendingItem.guid).toBe(loadedItem.guid);
			expect(pendingItem.ts).toBe(loadedItem.ts);
		});
	});

	describe('actions', () => {
		const {
			saveItem,
			receiveItem,
		} = actions;
		let ctx;

		beforeEach(() => {
			ctx = {
				commit: function () {}, // do not use arrow function
				rootState: {
					socket: {
						isConnected: true,
						$ws: {
							sendObj: function () {},
						},
					},
				},
			};
		});

		it('should send item and commit addItem on save', () => {
			spyOn(ctx, 'commit');
			spyOn(ctx.rootState.socket.$ws, 'sendObj');

			const msg = aDefaultSingleItemMsgBuilder().get();

			saveItem(ctx, msg);

			expect(ctx.rootState.socket.$ws.sendObj).toHaveBeenCalledTimes(1);
			expect(ctx.rootState.socket.$ws.sendObj).toHaveBeenCalledWith(msg);
			expect(ctx.commit).toHaveBeenCalledTimes(1);
			expect(ctx.commit).toHaveBeenCalledWith('addItem', msg);
		});

		it('should not send item on save while WS disconnected', () => {
			ctx.rootState.socket.isConnected = false;
			spyOn(ctx, 'commit');
			spyOn(ctx.rootState.socket.$ws, 'sendObj');

			const msg = aDefaultSingleItemMsgBuilder().get();

			saveItem(ctx, msg);

			expect(ctx.rootState.socket.$ws.sendObj).toHaveBeenCalledTimes(0);
			expect(ctx.commit).toHaveBeenCalledTimes(1);
		});

		it('should commit addItem when receive loaded item', () => {
			spyOn(ctx, 'commit');
			spyOn(ctx.rootState.socket.$ws, 'sendObj');

			const msg = aDefaultSingleItemMsgBuilder().get();

			receiveItem(ctx, msg);

			expect(ctx.rootState.socket.$ws.sendObj).toHaveBeenCalledTimes(0);
			expect(ctx.commit).toHaveBeenCalledTimes(1);
			expect(ctx.commit).toHaveBeenCalledWith('itemLoaded', msg);
		});
	});
});
