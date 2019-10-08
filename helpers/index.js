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
