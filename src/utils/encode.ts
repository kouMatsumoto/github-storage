export const toBase64 = (text: string) =>
	btoa(unescape(encodeURIComponent(text)));
