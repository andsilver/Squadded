import { prefetch } from '~/helpers';
import { PostStore, PostMutations } from '~/store/post';
import { API_ENDPOINT } from '~/config';

export const getShortURL = (url, store) =>
	new Promise((resolve) => {
		prefetch({
			store,
			type: 'shorten',
			url,
			key: 'url',
			value: url,
			mutation: `${PostStore}/${PostMutations.shortURL}`,
		}).then(
			({ shortURL: id }) => {
				const go = API_ENDPOINT.replace('api', 'go');
				const shortURL = `${go}/to/${id}`;
				resolve(shortURL);
			},
			() => resolve(url),
		);
		setTimeout(() => resolve(url), 3000);
	});
