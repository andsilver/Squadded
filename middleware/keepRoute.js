import { DEFAULT_LANDING } from '~/store/squad';

let latestPath = sessionStorage.getItem('latestPath');
let latestHash = sessionStorage.getItem('latestHash');

export default ({ store, route }) => {
	if (latestPath && store.state.squad.route.path === DEFAULT_LANDING) {
		store.state.squad.route = {
			path: latestPath,
			hash: latestHash,
		};
	}
	latestPath = route.path;
	latestHash = route.hash;
	sessionStorage.setItem('latestPath', latestPath);
	sessionStorage.setItem('latestHash', latestHash);
};

window.addEventListener('beforeunload', () => {
	sessionStorage.setItem('latestHash', location.hash);
});
