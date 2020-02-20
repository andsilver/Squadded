const { API_ENDPOINT } = process.env;
const AUTH_ENDPOINT = `${API_ENDPOINT}/auth`;

export const requestOtp = (email) => {
	if (!email) {
		return;
	}
	fetch(`${AUTH_ENDPOINT}/email/otp`, {
		method: 'POST',
		body: JSON.stringify({
			email,
		}),
	});
};

export const loginWithPIN = (pin, email) => {
	return fetch(`${AUTH_ENDPOINT}/email/signin`, {
		method: 'POST',
		body: JSON.stringify({
			pin,
			email,
		}),
	})
		.then(res => res.json())
		.catch(() => ({ error: true }));
};
