import { connect } from '~/plugins/init/ws';
import { ActivityStore, ActivityMutations, ActivityActions } from '~/store/activity';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { SquadStore, SquadMutations, SquadActions } from '~/store/squad';
import { ExploreStore, ExploreMutations } from '~/store/explore';
import { UserStore, UserMutations } from '~/store/user';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
import { INTERACTED_KEY } from '~/consts/keys';

export class WidgetIPC {
	constructor(store) {
		this.store = store;
	}

	dispatch (msg) {
		const { type } = msg;
		if (type !== 'dispatch' && this[type]) {
			this[type](msg);
		} else {
			// TODO: gracefull report
			// console.warn('Unknown message type', msg);
		}
	}

	injectMerchantParams (msg) {
		this.store.commit('SET_MERCHANT_PARAMS', msg);
	}

	injectSquadParams (msg) {
		const { state, navigate } = msg;

		const squad = msg.squad || localStorage.getItem('squad');
		localStorage.removeItem('squad');

		this.store.commit(`${SquadStore}/${SquadMutations.setSquadParams}`, { squad, navigate });
		this.widgetState(state);
	}

	loggedIn (msg) {
		this.store.commit(`${UserStore}/${UserMutations.setToken}`, msg.userToken);
		this.store.commit(`${ExploreStore}/${ExploreMutations.setFacebookFriends}`, msg.friends);
		connect(this.store);
	}

	async singleItemPost (msg) {
		if (!localStorage.getItem(INTERACTED_KEY)) {
			window.parent.postMessage(JSON.stringify({
				type: 'first-interaction',
			}), '*');
			this.store.commit(`${SquadStore}/${SquadMutations.interaction}`);
		}
		localStorage.setItem(INTERACTED_KEY, Date.now().toString());
		if (!this.store.state.socket || !this.store.state.socket.isAuth) {
			return;
		}
		if (!this.store.state.feed.items || !this.store.state.feed.items.length) {
			// tmp patch while infinite scroll not ready
			this.store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
		}
		msg.item.squadded = true;
		msg.item.merchantId = this.store.state.merchant.id;
		const post = await this.store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
		this.store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
		this.store.commit(`${ActivityStore}/${ActivityMutations.addPost}`, post);
	}

	removeItem(msg) {
		if (!this.store.state.socket || !this.store.state.socket.isAuth) {
			return;
		}
		const { itemId } = msg;
		this.store.dispatch(`${ActivityStore}/${ActivityActions.unwish}`, { itemId });
		this.store.commit(`${PostStore}/${PostMutations.unsquadd}`, itemId);
		this.store.commit(`${PairedItemStore}/${PairedItemMutations.unsquadd}`, itemId);
	}

	widgetState (msg) {
		const { open } = msg;

		this.store.commit(`${SquadStore}/${SquadMutations.setWidgetState}`, open);
	}

	checkout (msg) {
		if (!this.store.state.socket || !this.store.state.socket.isAuth) {
			return;
		}
		this.store.dispatch(`${SquadStore}/${SquadActions.postCheckout}`, msg);
	}

	openPost (msg) {
		const { postId } = msg;
		this.widgetState({ open: true });
		this.store.commit(`${SquadStore}/${SquadMutations.openPost}`, postId);
	}
}
