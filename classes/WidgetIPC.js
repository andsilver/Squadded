import { connect } from '~/plugins/init/ws';
import { ActivityStore, ActivityMutations, ActivityActions } from '~/store/activity';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { HomeStore, HomeMutations } from '~/store/home';
import { SquadStore, SquadMutations, SquadActions } from '~/store/squad';
import { ExploreStore, ExploreMutations } from '~/store/explore';
import { UserStore, UserMutations } from '~/store/user';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
import { OnboardingStore, OnboardingMutations } from '~/store/onboarding';
import { INTERACTED_KEY, GA_ACTIONS } from '~/consts';
import { onAuth } from '~/helpers';
import { setLocalStorageItem } from '~/utils/local-storage';

export class WidgetIPC {
	constructor(store, router, gaActionPrivate) {
		this.store = store;
		this.router = router;
		this.gaActionPrivate = gaActionPrivate;
	}

	dispatch(msg) {
		const { type } = msg;
		if (type !== 'dispatch' && this[type]) {
			this[type](msg);
		} else {
			// TODO: gracefull report
			// console.warn('Unknown message type', msg);
		}
	}

	injectMerchantParams(msg) {
		const { story, ...params } = msg;
		this.store.commit('SET_MERCHANT_PARAMS', params);
		this.store.commit(`${OnboardingStore}/${OnboardingMutations.setVideos}`, story);
	}

	injectSquadParams(msg) {
		const { state, navigate } = msg;

		const squad = msg.squad || localStorage.getItem('squad');
		localStorage.removeItem('squad');

		this.store.commit(`${SquadStore}/${SquadMutations.setSquadParams}`, { squad, navigate });
		this.widgetState(state);
	}

	loggedIn(msg) {
		this.store.commit(`${UserStore}/${UserMutations.setToken}`, msg.userToken);
		this.store.commit(`${ExploreStore}/${ExploreMutations.setFacebookFriends}`, msg.friends);
		connect(this.store);
	}

	async singleItemPost(msg) {
		if (!localStorage.getItem(INTERACTED_KEY)) {
			window.parent.postMessage(
				JSON.stringify({
					type: 'first-interaction',
				}),
				'*',
			);
			this.store.commit(`${SquadStore}/${SquadMutations.interaction}`);
		}
		setLocalStorageItem(INTERACTED_KEY, Date.now().toString());
		if (!this.store.state.socket || !this.store.state.socket.isAuth) {
			if (this.store.state.onboarding.videos.length) {
				return this.router.push('/onboarding');
			}
			return;
		}
		if (!this.store.state.feed.items || !this.store.state.feed.items.length) {
			// tmp patch while infinite scroll not ready
			this.store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
		}
		msg.item.squadded = true;
		msg.item.merchantId = this.store.state.merchant.id;
		msg.item.merchantSiteTitle = this.store.state.merchant.siteTitle;
		const post = await this.store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
		this.store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
		this.store.commit(`${ActivityStore}/${ActivityMutations.addPost}`, {
			post,
			merchantId: this.store.state.merchant.id,
			userId: this.store.state.user.me.userId,
		});
		this.gaActionPrivate(GA_ACTIONS.WISHLIT_ADD_MERCHANT);
	}

	removeItem(msg) {
		if (!this.store.state.socket || !this.store.state.socket.isAuth) {
			return;
		}
		const { itemId } = msg;
		this.store.dispatch(`${ActivityStore}/${ActivityActions.unwish}`, { itemId });
		this.store.commit(`${PostStore}/${PostMutations.unsquadd}`, itemId);
		this.store.commit(`${FeedStore}/${FeedMutations.unsquadd}`, itemId);
		this.store.commit(`${HomeStore}/${HomeMutations.unsquadd}`, itemId);
		this.store.commit(`${PairedItemStore}/${PairedItemMutations.unsquadd}`, itemId);
	}

	widgetState(msg) {
		const { open } = msg;
		this.store.commit(`${SquadStore}/${SquadMutations.setWidgetState}`, open);

		if (open) {
			this.gaActionPrivate(GA_ACTIONS.OPEN_ASIDE);
		} else {
			this.gaActionPrivate(GA_ACTIONS.CLOSE_ASIDE);
		}
	}

	async checkout(msg) {
		await onAuth(this.store);
		this.store.dispatch(`${SquadStore}/${SquadActions.postCheckout}`, msg);
	}

	openPost(msg) {
		const { postId } = msg;
		this.widgetState({ open: true });
		this.store.commit(`${SquadStore}/${SquadMutations.openPost}`, postId);
	}

	injectLocalStorageValues(msg) {
		const { data } = msg;

		for (const pair of data) {
			const { key, value } = pair;
			localStorage.setItem(key, value);
			if (key === 'userToken') {
				this.store.commit(`${UserStore}/${UserMutations.setToken}`, value);
			}
		}
	}
}
