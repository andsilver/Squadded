import { USER_TOKEN_KEY } from '~/consts/keys';

export const tokenExist = () => !!localStorage.getItem(USER_TOKEN_KEY);
