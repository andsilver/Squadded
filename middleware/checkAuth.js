import { isPublic, isHome, isOnboarding } from '~/helpers';

export default function (param) {
	const { route, redirect, store } = param;
	if (!store.state.socket.isAuth && !isPublic(route.name)) {
		redirect({ path: '/onboarding' });
	} else if (store.state.socket.isAuth && (isHome(route.name) || isOnboarding(route.name))) {
		redirect({ path: '/feed' });
	}
}
