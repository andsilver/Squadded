export const SquadStore = 'squad';

export const state = () => ({
	route: { path: '/feed' },
});

const SearchParamName = {
	user: 'id',
};

function getRoute (squadParam) {
	const [ name, value ] = squadParam.split(':');
	return {
		name,
		query: {
			[SearchParamName[name]]: value,
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
