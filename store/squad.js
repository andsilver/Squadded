import { API_ENDPOINT } from '~/config';

export const SquadStore = 'squad';

export const DEFAULT_LANDING = '/feed';

export const state = () => ({
	API_ENDPOINT,
	route: { path: DEFAULT_LANDING },
	widget: {
		open: false,
	},
	virtualKeyboard: false,
});

const ParamName = {
	user: {
		name: 'user-id',
		key: 'id',
	},
	post: {
		name: 'post-id',
		key: 'id',
	},
	_error: {
		name: 'error',
	},
};

function getRoute (squadParam) {
	const [name, param] = squadParam.split(':');
	let value, suffix;
	param && ([value, suffix] = param.split('_'));
	const route = {
		name: ParamName[name].name,
		params: param ? {
			[ParamName[name].key]: value,
		} : {},
	};
	if (suffix) {
		route.query = { [suffix]: true };
	}
	return route;
}

export const SquadMutations = {
	setSquadParams: 'setSquadParams',
	setWidgetState: 'setWidgetState',
	interaction: 'interaction',
	openPost: 'openPost',
};

export const mutations = {
	[SquadMutations.setSquadParams]: (state, { squad }) => {
		if (!squad) {
			return;
		}
		state.route = getRoute(squad);
	},
	[SquadMutations.setWidgetState]: (state, open) => {
		state.widget.open = open;
	},
	[SquadMutations.interaction]: () => {},
	[SquadMutations.openPost]: () => {},
};

export const SquadActions = {
	postCheckout: 'postCheckout',
};

export const actions = {
	[SquadActions.postCheckout]: ({ rootState }, { items, currency, totalPrice, orderId }) => {
		rootState.socket.$ws.sendObj({
			type: 'checkout',
			items,
			totalPrice,
			currency,
			orderId,
		});
	},
};

export default {
	mutations,
	namespaced: true,
	state,
	actions,
};
