export default function (param) {
	const { route, store } = param;

	switch (route.name) {
	case 'notifications':
		store.commit('SET_LAYOUT', true);
		break;
	default:
		store.commit('SET_LAYOUT', false);
		break;
	}
}
