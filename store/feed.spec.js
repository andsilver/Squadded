import { mutations, actions } from './feed';

describe('Feed store module', () => {
	describe('mutations', () => {
		const { setItems, addItem } = mutations;

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

			const newItem = {};
			addItem(state, newItem);
			expect(state.items.length).toBe(1);
			expect(state.items[state.items.length - 1]).toBe(newItem);
		});
	});

	describe('actions', () => {
		const { saveItem } = actions;

		it('should commit addItem on save', () => {
			const ctx = {
				commit: function () {}, // do not use arrow function
			};
			spyOn(ctx, 'commit');

			const mockItem = {};

			saveItem(ctx, mockItem);

			expect(ctx.commit).toHaveBeenCalledTimes(1);
			expect(ctx.commit).toHaveBeenCalledWith('addItem', mockItem);
		});
	});
});
