import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import { outfitPostBuilder } from '../test/outfit.post.mock';
import { aDefaultPollMsgBuilder } from '../test/poll.post.mock';
import { itemBuilder } from '../test/item.mock';
import { userMockBuilder } from '../test/user.mock';
import { PairedItemStore, PairedItemActions, mutations, getters } from './paired-item';
import store from './index';

describe('Paired Item store', () => {
	let root;
	let state;
	let $ws;

	beforeEach(() => {
		const localVue = createLocalVue();
		localVue.use(Vuex);
		$ws = { sendObj: jest.fn() };
		root = new Vuex.Store(store);
		root.state.socket.isConnected = true;
		root.state.merchant.id = 'aDummyMerchantId';
		root.state.socket.$ws = $ws;
		state = {
			item: null,
			allPosts: [],
			hesitatingUsers: [],
		};
	});

	const mockAllPosts = () => {
		return [
			...new Array(3).fill(aDefaultPollMsgBuilder().get()),
			...new Array(3).fill(outfitPostBuilder().get()),
			...new Array(3).fill(aDefaultPollMsgBuilder().get()),
		];
	};

	const mockHesitatingUsers = () => {
		return new Array(5).fill(userMockBuilder().short());
	};

	it('getItem getter', () => {
		const item = itemBuilder().get();
		state.item = item;
		expect(getters.getItem(state)).toEqual(item);
	});

	it('getAllPosts getter', () => {
		const allPosts = mockAllPosts();
		state.allPosts = allPosts;
		expect(getters.getAllPosts(state)).toEqual(allPosts);
	});

	it('getOutfitPosts getter', () => {
		const allPosts = mockAllPosts();
		state.allPosts = allPosts;
		const outfitPosts = getters.getOutfitPosts(state);
		const allOutfitType = outfitPosts.every(post => post.type === 'outfitPost');
		expect(allOutfitType).toBeTruthy();
	});

	it('getPollPosts getter', () => {
		const allPosts = mockAllPosts();
		state.allPosts = allPosts;
		const pollPosts = getters.getPollPosts(state);
		const allPollPostType = pollPosts.every(post => post.type === 'pollPost');
		expect(allPollPostType).toBeTruthy();
	});

	it('setItem mutation', () => {
		const item = itemBuilder().get();
		mutations.setItem(state, item);
		expect(state.item).toEqual(item);
	});

	it('setAllPosts mutation', () => {
		const allPosts = mockAllPosts();
		mutations.setAllPosts(state, allPosts);
		expect(state.allPosts).toEqual(allPosts);
	});

	it('setHesitatingUsers mutation', () => {
		const hesitatingUsers = mockHesitatingUsers();
		mutations.setHesitatingUsers(state, hesitatingUsers);
		expect(state.hesitatingUsers).toEqual(hesitatingUsers);
	});

	it('initPairedItem action', async () => {
		const varId = 'any';
		const itemId = 'any';
		const postId = 'any';
		await root.dispatch(`${PairedItemStore}/${PairedItemActions.initPairedItem}`, { varId, itemId, postId });
		expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
			type: 'fetchItem',
			varId,
			itemId,
			postId,
		});
		expect(root.state.pairedItem.item).toBeNull();
		expect(root.state.pairedItem.hesitatingUsers).toHaveLength(0);
		expect(root.state.pairedItem.allPosts).toHaveLength(0);
	});

	it('setPairedItem action', async () => {
		const item = aDefaultSingleItemMsgBuilder().get();
		const allPosts = mockAllPosts();
		const hesitatingUsers = mockHesitatingUsers();
		await root.dispatch(`${PairedItemStore}/${PairedItemActions.setPairedItem}`, { item, allPosts, hesitatingUsers });
		expect(root.state.pairedItem.item).toEqual(item);
		expect(root.state.pairedItem.hesitatingUsers).toEqual(hesitatingUsers);
		expect(root.state.pairedItem.allPosts).toEqual(allPosts);
	});
});
