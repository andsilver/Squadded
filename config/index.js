let apiEndpoint = process.env.API_ENDPOINT;
let wsLink = process.env.WS_LINK;

const deriveApiEndpointFromLocation = () => {
	const { host, protocol } = window.location;
	let apiHost;

	if (!apiEndpoint) {
		const segs = host.split('.');
		segs[0] = 'api';
		apiHost = segs.join('.');
		apiEndpoint = `${protocol}//${apiHost}`;
	}

	if (!wsLink) {
		wsLink = `${protocol === 'http:' ? 'ws' : 'wss'}://${apiHost}/`;
	}
};

deriveApiEndpointFromLocation();

export const API_ENDPOINT = apiEndpoint;
export const WS_LINK = wsLink;
