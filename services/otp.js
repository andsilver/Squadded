import { API_ENDPOINT } from '~/config';

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

export const loginWithPIN = async (pin, email, params) => {
	try {
		const res = await fetch(`${AUTH_ENDPOINT}/email/signup`, {
			method: 'POST',
			body: JSON.stringify({
				pin,
				email,
				...params,
			}),
		});
		return await res.json();
	} catch (e) {
		return { error: true };
	}
};
