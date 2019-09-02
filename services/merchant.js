const { API_LINK } = process.env;

function validateAllowedOrigins (merchantId) {
	return fetch(`${API_LINK}/merchant/${merchantId}/origins`)
		.then(response => response.json())
		.then((json) => {
			const { ancestorOrigins } = window.location;
			const parentOrigin = ancestorOrigins[ancestorOrigins.length - 1];
			if (!json.list.includes(parentOrigin)) {
				throw new Error('Forbidden');
			};
		});
};

export default {
	validateAllowedOrigins,
};
