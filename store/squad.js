export const SquadStore = 'squad';

export const DEFAULT_LANDING = '/feed';

export const state = () => ({
	route: { path: DEFAULT_LANDING },
});

const ParamName = {
	user: 'id',
};

function getRoute (squadParam) {
	const [ name, value ] = squadParam.split(':');
	return {
		name: `${name}-${ParamName[name]}`,
		params: {
			[ParamName[name]]: value,
		},
	};
}

export const SquadMutations = {
	setSquadParams: 'setSquadParams',
};

export const mutations = {
	[SquadMutations.setSquadParams]: (state, squad) => {
		state.route = getRoute(squad);
	},
};

export default {
	mutations,
	namespaced: true,
	state,
};
