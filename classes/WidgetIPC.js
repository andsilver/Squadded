import { connect } from '~/plugins/init/ws';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';
import { SquadStore, SquadMutations } from '~/store/squad';
import { UserStore, UserMutations } from '~/store/user';

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
		const { squad, state } = msg;

		this.store.commit(`${SquadStore}/${SquadMutations.setSquadParams}`, squad);
		this.widgetState(state);
	}

	loggedIn (msg) {
		this.store.commit(`${UserStore}/${UserMutations.setToken}`, msg.userToken);
		connect(this.store);
	}

	async singleItemPost (msg) {
		if (!this.store.state.feed.items.length) {
			// tmp patch while infinite scroll not ready
			this.store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
		}
		msg.item.squadded = true;
		const post = await this.store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
		this.store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
		this.store.commit(`${ActivityStore}/${ActivityMutations.addPost}`, post);
		if (!localStorage.getItem('interacted')) {
			window.parent.postMessage(JSON.stringify({
				type: 'first-interaction',
			}), '*');
		}
		localStorage.setItem('interacted', Date.now().toString());
	}

	widgetState (msg) {
		const { open } = msg;

		this.store.commit(`${SquadStore}/${SquadMutations.setWidgetState}`, open);
	}
}
