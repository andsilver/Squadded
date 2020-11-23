import { isPublic, isHome } from '~/helpers';
import { tokenExist } from '~/utils/isAuth';

export default function(ctx) {
	const { route, redirect, $isAuth, $isGuest, $isGuestMode } = ctx;

	if (!tokenExist() && !isPublic(route.name)) {
		/** public page is allowed only for authenticated user or in guest mode */
		if ($isGuestMode()) {
			return redirect({ path: '/community' });
		}
		return redirect({ path: '/' });
	}

	if (!$isAuth() && !isPublic(route.name)) {
		/** user is not authorized & guest and trying to access public page */
		if ($isGuestMode()) {
			redirect({ path: '/community' });
		} else {
			redirect({ path: '/' });
		}
	} else if ($isAuth() && isHome(route.name)) {
		/** user is authorized and is going to login page */
		if ($isGuest()) {
			/** guest user shouldnt be able to see feed page */
			redirect({ path: '/all' });
		} else {
			redirect({ path: '/feed' });
		}
	}

	if ($isGuest() && route.name === 'feed') {
		redirect({ path: '/all' });
	}
}
