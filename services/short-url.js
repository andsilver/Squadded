import { prefetch } from '~/helpers';
import { PostStore, PostMutations } from '~/store/post';

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
				const { host } = window.location;
				const segs = host.split('.');
				segs[0] = 'go';
				const shortURL = `${window.location.protocol}//${segs.join('.')}/to/${id}`;
				resolve(shortURL);
			},
			() => resolve(url),
		);
		setTimeout(() => resolve(url), 3000);
	});
