export const copyToClipboard = (link, el) => {
	if (!el) { return; }
	const fallbackCopyToClipboard = (link) => {
		try {
			el.setAttribute('type', 'text');
			el.value = link;
			el.select();

			document.execCommand('copy');
			el.setAttribute('type', 'hidden');
			window.getSelection().removeAllRanges();
		} catch (error) {
			console.error(error); // eslint-disable-line no-console
		};
	};

	if (!window.navigator.clipboard) {
		fallbackCopyToClipboard(link);
		return;
	}

	try {
		window.navigator.clipboard.writeText(link);
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
	};
};
