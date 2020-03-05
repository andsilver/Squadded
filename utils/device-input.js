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

export const isMobile = () => {
	if (navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/i) ||
		navigator.userAgent.match(/Windows Phone/i)
	) {
		return true;
	}
	return false;
};
