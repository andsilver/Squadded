import { isPublic } from '~/helpers';
import { isAuth } from '~/utils/isAuth';

export default function (param) {
	const { route, redirect } = param;
	if (!isAuth() && !isPublic(route.name)) {
		redirect({ path: '/onboarding' });
	}
}
