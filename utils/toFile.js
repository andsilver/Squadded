export const toFile = async (data, name) => {
	const type = detectMimeType(data);
	const res = await fetch(data);
	const buf = await res.arrayBuffer();
	return new File([buf], name, { type });
};

const detectMimeType = data => /data:(.*);base64,(.*)/.exec(data)[1];
