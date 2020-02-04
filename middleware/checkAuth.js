import { isHome, isPublic } from '~/helpers';

export default function ({ from, route, redirect }) {
	const userToken = localStorage.getItem('userToken');
	if (!userToken && ((isHome(route.name) && isHome(from.name)) || !isPublic(route.name))) {
		redirect({ path: '/onboarding' });
	}
}
