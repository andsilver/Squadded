import { connect } from './init/ws';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';
import { SquadStore, SquadMutations } from '~/store/squad';
import { UserStore, UserMutations } from '~/store/user';

const post = async (store, msg) => {
	if (!store.state.feed.items.length) {
		// tmp patch while infinite scroll not ready
		store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
	}
	msg.item.squadded = true;
	const post = await store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
	store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
	store.commit(`${ActivityStore}/${ActivityMutations.addPost}`, post);
};

const actions = {
	singleItemPost: post,
	injectMerchantParams: (store, msg) => {
		store.commit('SET_MERCHANT_PARAMS', msg);
	},
	loggedIn: (store, msg) => {
		store.commit(`${UserStore}/${UserMutations.setToken}`, msg.userToken);
		connect(store);
	},
	injectSquadParams: (store, msg) => {
		const { squad } = msg;

		store.commit(`${SquadStore}/${SquadMutations.setSquadParams}`, squad);
	},
	widgetState: (store, msg) => {
		const { open } = msg;

		store.commit(`${SquadStore}/${SquadMutations.setWidgetState}`, open);
	},
};

export const dispatch = (store, msg) => {
	if (actions[msg.type]) {
		actions[msg.type](store, msg);
	} else {
		// TODO: gracefull report
		// console.warn('Unknown message type', msg);
	}
};

export default function (ctx) {
	function parseMessage (event) {
		let msg;
		try {
			msg = JSON.parse(event.data);
		} catch (error) {
			// TODO: gracefull report
			return;
		}

		const { store } = ctx;
		dispatch(store, msg);
	}

	window.addEventListener('message', parseMessage);
	window.parent.postMessage('SquadWidgetIsReady', '*');
};
