import { isPublic, isHome } from '~/helpers';

export default function (param) {
	const { route, redirect, store } = param;

	if (!localStorage.getItem('userToken') && !isPublic(route.name)) {
		redirect({ path: '/signin' });
	}

	if (!store.state.socket.isAuth && !isPublic(route.name)) {
		redirect({ path: '/signin' });
	} else if (store.state.socket.isAuth && (isHome(route.name) || route.name === 'signin')) {
		redirect({ path: '/feed' });
	}
}
