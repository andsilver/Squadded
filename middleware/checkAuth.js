import { isPublic } from '~/helpers';

export default function ({ route, redirect }) {
	const userToken = localStorage.getItem('userToken');
	if (!userToken && !isPublic(route.name)) {
		redirect({ path: '/community' });
	}
}
