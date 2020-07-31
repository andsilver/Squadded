export const addGAquery = (rawUrl) => {
	if (typeof rawUrl !== 'string') {
		throw new TypeError('Expected type string');
	}

	const url = new URL(rawUrl);
	const params = new URLSearchParams(url.search.slice(1));

	params.set('utm_source', 'squadded');
	params.set('utm_medium', 'feed');
	params.set('utm_campaign', 'squadded');

	url.search = params.toString();
	const urlWithQuery = url.href;
	return urlWithQuery;
};
