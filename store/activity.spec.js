import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import { ActivityStore, ActivityActions, mutations } from './activity';
import store from './index';

const types = ['blog', 'wishlist'];
const localVue = createLocalVue();
localVue.use(Vuex);

let spy = null;

describe('Activity store module', () => {
	afterEach(() => {
		if (spy) {
			spy.calls.reset();
			spy = null;
		}
	});

	describe('mutations', () => {
		const {
			addPost,
			removePost,
			removeWish,
			clearWishlist,
			clearBlog,
			setListOfType,
			unsquadd,
		} = mutations;

		let state;

		beforeEach(() => {
			state = {
				blog: [],
				wishlist: [],
				allLoaded: {
					blog: false,
					wishlist: false,
				},
				guid: {
					blog: null,
					wishlist: null,
				},
				loadedNew: false,
				loading: {
					blog: false,
					wishlist: false,
				},
				myWishlist: [],
			};
		});

		it('should add a post', () => {
			const post = aDefaultSingleItemMsgBuilder()
				.withUser()
				.get();
			state.blog = [post];
			state.wishlist = [post];
			addPost(state, { post });
			expect(state.blog[0]).toStrictEqual(post);
			expect(state.wishlist[0]).toStrictEqual(post);
		});

		it('should remove a post', () => {
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.get();
			state.blog = [post];
			state.wishlist = [post];
			removePost(state, post.postId);
			expect(state.blog.length).toBe(0);
			expect(state.wishlist.length).toBe(0);
		});

		it('should remove a post from wishlist', () => {
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.get();
			state.wishlist = [post];
			removeWish(state, post);
			expect(state.wishlist.length).toBe(0);
		});

		it('should clear wishlist', () => {
			clearWishlist(state);
			expect(state.wishlist).toBe(null);
		});

		it('should set list per type', () => {
			const posts = new Array(3).fill(
				aDefaultSingleItemMsgBuilder()
					.withGUID()
					.get(),
			);
			types.forEach((type) => {
				setListOfType(state, { posts, type });
				expect(state[type]).toStrictEqual(posts);
			});
		});

		it('should clear blog', () => {
			clearBlog(state);
			expect(state.blog).toBe(null);
		});

		it('should unsquadd item', () => {
			const post = aDefaultSingleItemMsgBuilder().get();
			const { item } = post;
			state.blog = [post];
			unsquadd(state, item.itemId);
			expect(state.blog.length).toBe(0);
		});
	});

	describe('actions', () => {
		let root;
		let $ws;

		const aDummyMerchantId = 'aDummyMerchantId';

		beforeEach(() => {
			$ws = { sendObj: jest.fn() };
			root = new Vuex.Store(store);
			root.state.socket.isConnected = true;
			root.state.merchant.id = aDummyMerchantId;
			root.state.socket.$ws = $ws;
			root.state.commit = jest.fn();
		});

		it('should send unwish message, remove wish and unsquad', async () => {
			const post = aDefaultSingleItemMsgBuilder().get();
			const { item } = post;
			root.state.activity.wishlist = [post];

			await root.dispatch(`${ActivityStore}/${ActivityActions.unwish}`, item);

			expect($ws.sendObj).toHaveBeenCalledWith({
				type: 'unwish',
				itemId: item.itemId,
				varId: item.varId,
				itemMerchantId: item.merchantId,
			});
			expect(root.state.activity.wishlist.length).toBe(0);
		});

		it('should fetch items', async () => {
			const post = aDefaultSingleItemMsgBuilder().get();
			const guid = 'guid';
			for (const type of types) {
				root.state.activity.allLoaded[type] = false;
				root.state.activity[type] = [post];
				root.state.activity.guid[type] = guid;
			}
			const msg = {
				type: 'fetchBlog',
				from: post.ts,
				guid,
			};
			await root.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, { type: 'blog', loadedNew: false, guid });
			expect($ws.sendObj).toHaveBeenCalledWith(msg);
		});

		it('should not fetch new items if all loaded', async () => {
			for (const type of types) {
				root.state.activity.allLoaded[type] = true;
				await root.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, { type, guid: null, loadedNew: false });
				expect($ws.sendObj).not.toHaveBeenCalled();
			}
		});
	});
});
