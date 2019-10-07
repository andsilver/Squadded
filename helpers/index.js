export const isHome = routeName => (routeName === 'index');

export const shortNumber = (number, locale = 'en') => new Intl.NumberFormat(locale, { notation: 'compact', compactDisplay: 'short' }).format(number);
