export const copy = () => {
	try {
		document.execCommand('copy');
	} catch (err) {
		console.error(err); // eslint-disable-line no-console
	}
};
