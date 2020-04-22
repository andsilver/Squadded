import { isPublic, isHome } from '~/helpers';

export default function (param) {
	const { route, redirect, store } = param;

	if (!localStorage.getItem('userToken') && !isPublic(route.name)) {
		redirect({ path: '/' });
	}

	if (!store.state.socket.isAuth && !isPublic(route.name)) {
		redirect({ path: '/' });
	} else if (store.state.socket.isAuth && (isHome(route.name))) {
		redirect({ path: '/feed' });
	}
}
