import { USER_TOKEN_KEY } from '~/consts/keys';
import { ROOT_EVENTS } from '~/consts';
import { guestLogin } from '~/services/user';

export const tokenExist = () => !!localStorage.getItem(USER_TOKEN_KEY);
export const isAuth = store => store.state.socket.isAuth;
export const isGuestMode = store => store.state.merchant.guest;
export const isGuest = ({ state: { merchant, socket, user } }) => (!socket.isAuth && merchant.guest) || (socket.isAuth && user.me.guest);
export const checkActionPermission = async (store, root, letGuestLogin = true) => {
	if (!isAuth(store)) {
		if (isGuestMode(store) && letGuestLogin) {
			return await guestLogin(store);
		} else {
			root.$emit(ROOT_EVENTS.SHOW_SIGNIN_DIALOG, true);
		}
		return false;
	}
	return true;
};
