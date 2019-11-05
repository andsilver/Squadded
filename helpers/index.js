export const isHome = routeName => (routeName === 'index');

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

export async function prefetch({ guid, mutation, store, type }) {
	if (!store.state.socket.$ws) {
		await onStoreMutation(store, 'SET_SOCKET_AUTH', true);
	}
	store.state.socket.$ws.sendObj({ type, guid });
	return mutation ? onStoreMutation(store, mutation) : Promise.resolve();
}

export function flushPromises() {
	return new Promise(resolve => setImmediate(resolve));
}
