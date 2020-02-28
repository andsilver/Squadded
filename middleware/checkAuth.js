import { isPublic, isHome, isOnboarding } from '~/helpers';
import { tokenExist } from '~/utils/isAuth';

export default function (param) {
	const { route, redirect, store } = param;
	if (!tokenExist() && !isPublic(route.name)) {
		redirect({ path: '/onboarding' });
	} else if (store.state.socket.isAuth && (isHome(route.name) || isOnboarding(route.name))) {
		redirect({ path: '/feed' });
	}
}
