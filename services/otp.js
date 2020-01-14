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

export const loginWithPIN = async (pin, email) => {
	let res = await fetch(`${AUTH_ENDPOINT}/email/signin`, {
		method: 'POST',
		body: JSON.stringify({
			pin,
			email,
		}),
	});
	res = res.json();
	return res;
};
