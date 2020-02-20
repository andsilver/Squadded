import { NAME_SELECTED_KEY } from '~/consts/keys';

export const nameSelected = () => !!localStorage.getItem(NAME_SELECTED_KEY);
export const setNameSelected = () => localStorage.setItem(NAME_SELECTED_KEY, Date.now().toString());
