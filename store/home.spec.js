import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import { HomeStore, HomeActions, mutations } from './home';
import store from './index';

const localVue = createLocalVue();
localVue.use(Vuex);

let spy = null;

describe('Home store module', () => {
	afterEach(() => {
		if (spy) {
			spy.calls.reset();
			spy = null;
		}
	});

	describe('mutations', () => {
		const { clear, receive, markAllLoaded, removePost } = mutations;

		let state;

		beforeEach(() => {
			state = {
				posts: null,
				watchers: [],
				public: [],
				interactions: [],
				allLoaded: false,
				loading: false,
				loadedNew: false,
				interactionPage: null,
			};
		});

		it('should remove a post', () => {
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.get();
			state.posts = [post];
			removePost(state, post.postId);
			expect(state.posts.length).toBe(0);
		});

		it('should receive posts', () => {
			const posts = new Array(5).fill(
				aDefaultSingleItemMsgBuilder()
					.withGUID()
					.get(),
			);
			const watchers = new Array(5).fill(
				aDefaultSingleItemMsgBuilder()
					.withGUID()
					.get(),
			);
			const publicPosts = new Array(5).fill(
				aDefaultSingleItemMsgBuilder()
					.withGUID()
					.get(),
			);
			const interactions = new Array(5).fill(
				aDefaultSingleItemMsgBuilder()
					.withGUID()
					.get(),
			);
			const interactionPage = 1;

			receive(state, { posts, watchers, publicPosts, interactions, interactionPage });
			expect(state.posts).toStrictEqual(posts);
			expect(state.watchers).toStrictEqual(watchers);
			expect(state.public).toStrictEqual(publicPosts);
			expect(state.interactions).toStrictEqual(interactions);
			expect(state.interactionPage).toBe(interactionPage);
		});

		it('should clear home', () => {
			clear(state);
			expect(state.posts).toBe(null);
			expect(state.allLoaded).toBe(false);
			expect(state.loadedNew).toBe(false);
		});

		it('should set allLoaded', () => {
			state.loadedNew = false;
			markAllLoaded(state, []);
			expect(state.allLoaded).toBe(true);
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

		it('should fetch items', async () => {
			const post = aDefaultSingleItemMsgBuilder().get();
			const interactionPost = aDefaultSingleItemMsgBuilder().get();
			const publicPost = aDefaultSingleItemMsgBuilder().get();
			const watcher = aDefaultSingleItemMsgBuilder().get();
			root.state.home.allLoaded = false;
			root.state.home.posts = [post];
			root.state.home.interactions = [{ post: interactionPost }];
			root.state.home.public = [publicPost];
			root.state.home.watchers = [watcher];
			root.state.home.interactionPage = 1;
			const msg = {
				type: 'fetchHome',
				watcherFrom: watcher.ts,
				publicFrom: publicPost.ts,
				interactLastPost: interactionPost.guid,
				interactLastPage: 1,
			};
			await root.dispatch(`${HomeStore}/${HomeActions.fetch}`, false);
			expect($ws.sendObj).toHaveBeenCalledWith(msg);
		});

		it('should not fetch new items if all loaded', async () => {
			root.state.home.allLoaded = true;
			await root.dispatch(`${HomeStore}/${HomeActions.fetch}`, false);
			expect($ws.sendObj).not.toHaveBeenCalled();
		});
	});
});
