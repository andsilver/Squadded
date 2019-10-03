import { isHome } from '~/helpers';

export default function ({ route, redirect }) {
	const userToken = localStorage.getItem('userToken');
	if (!userToken && !isHome(route.name)) {
		redirect({ path: '/' });
	}
}
