export const isHome = routeName => (routeName === 'index');

export const isPublic = routeName => isHome(routeName) || routeName === 'community';

export const shortNumber = (number, locale = 'en') => new Intl.NumberFormat(locale, { notation: 'compact', compactDisplay: 'short' }).format(number);

export const onStoreMutation = (store, type, value) => new Promise((resolve) => {
	const unsubscribe = store.subscribe((mutation) => {
		if (mutation.type === type) {
			if (value !== undefined && value !== mutation.payload) {
				return;
			}
			unsubscribe();
			resolve(mutation.payload);
		}
	});
});

export const onAuth = (store) => {
	return store.state.socket.isAuth ? Promise.resolve(true) : onStoreMutation(store, 'SET_SOCKET_AUTH', true);
};

export async function prefetch({ mutation, store, type, ...props }) {
	await onAuth(store);
	store.state.socket.$ws.sendObj({ type, ...props });
	return mutation ? onStoreMutation(store, mutation) : Promise.resolve();
}

export function flushPromises() {
	return new Promise(resolve => setImmediate(resolve));
}

export const price = (currency, cents, locale) => `${currency}${(cents / 100).toLocaleString(locale)}`;
