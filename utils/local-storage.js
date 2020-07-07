export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const setLocalStorageItem = (key, value) => {
	localStorage.setItem(key, value);
	isSafari && window.parent.postMessage(JSON.stringify({ type: 'local-storage', key, value, action: 'SET' }), '*');
};

export const removeLocalStorageItem = (key) => {
	localStorage.removeItem(key);
	isSafari && window.parent.postMessage(JSON.stringify({ type: 'local-storage', key, action: 'REMOVE' }), '*');
};

export const clearLocalStorage = () => {
	localStorage.clear();
	isSafari && window.parent.postMessage(JSON.stringify({ type: 'local-storage', action: 'CLEAR' }), '*');
};
