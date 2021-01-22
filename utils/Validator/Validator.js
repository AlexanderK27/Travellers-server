const isBase64 = require('validator/lib/isBase64');

class Validator {
	constructor() {}
	static usernameMinLength = 3;
	static usernameMaxLength = 20;
	static usernameAllowedSym = /^[a-zA-Z0-9._]+$/;

	static async isBase64(image, errorMessage = 'Invalid image format') {
		if (!image) return null;

		return isBase64('' + image) ? image : Promise.reject(errorMessage);
	}

	static toBufferOrNull(value) {
		return value ? Buffer.from(value, 'base64') : null;
	}

	static isString(value) {
		return typeof value === 'string';
	}

	static isUsernameValid(name) {
		return (
			name.length >= this.usernameMinLength &&
			name.length <= this.usernameMaxLength &&
			this.usernameAllowedSym.test(name)
		);
	}

	static toStringArrayOrNull(arr) {
		return !Array.isArray(arr) ? null : arr.filter(value => this.isString(value));
	}

	static toZeroNaturalOrNull(value) {
		return isNaN(value) || value < 0 ? null : Math.round(value);
	}
}

module.exports = Validator;
