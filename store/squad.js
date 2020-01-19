const { API_ENDPOINT } = process.env;

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
};

function getRoute (squadParam) {
	const [name, param] = squadParam.split(':');
	const [value, suffix] = param.split('_');
	const route = {
		name: ParamName[name].name,
		params: {
			[ParamName[name].key]: value,
		},
	};
	if (suffix) {
		route.query = { [suffix]: true };
	}
	return route;
}

export const SquadMutations = {
	setSquadParams: 'setSquadParams',
	setWidgetState: 'setWidgetState',
};

export const mutations = {
	[SquadMutations.setSquadParams]: (state, squad) => {
		if (!squad) {
			return;
		}
		state.route = getRoute(squad);
	},
	[SquadMutations.setWidgetState]: (state, open) => {
		state.widget.open = open;
	},
};

export default {
	mutations,
	namespaced: true,
	state,
};
