import { USER_TOKEN_KEY } from '~/consts/keys';

export const isAuth = () => !!localStorage.getItem(USER_TOKEN_KEY);
