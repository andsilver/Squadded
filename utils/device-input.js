const mq = query => window.matchMedia(query).matches;

export const isTouch = () => {
	const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

	if (matchMedia('(pointer:coarse)').matches ||
		('ontouchstart' in window) ||
		(window.DocumentTouch && document instanceof window.DocumentTouch)) {
		return true;
	}

	// include the 'heartz' as a way to have a non matching MQ to help terminate the join
	// https://git.io/vznFH
	const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
	return mq(query);
};

const OUTER_HEIGHT = window.screen.height - window.innerHeight;

export const onToggleKeyboard = (trigger) => {
	window.addEventListener('resize', () => {
		setTimeout(() => {
			trigger(window.innerHeight < window.screen.height - OUTER_HEIGHT);
		}, 10);
	});
};
