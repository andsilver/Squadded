export default ({ store, $gtag }, inject) => {
	const gaAction = (action) => {
		window.parent.postMessage(
			JSON.stringify({
				type: 'GA',
				action,
			}),
			'*',
		);
		window.FS && window.FS.event(action, {});
		gaActionPrivate(action);
	};

	const gaActionPrivate = (action) => {
		if (!$gtag) {
			return;
		}
		$gtag('event', action, {
			event_category: store.state.merchantId,
			event_label: action,
		});
	};

	inject('gaAction', gaAction);
	inject('gaActionPrivate', gaActionPrivate);
};
