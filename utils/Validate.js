const isEmail = require('validator/lib/isEmail');
const normalizeEmail = require('validator/lib/normalizeEmail');

class Validate {
	constructor(isEmail, normalizeEmail) {
		this.isEmail = isEmail;
		this.normalizeEmail = normalizeEmail;
	}

	async Email(value, errorMessage = 'Invalid email') {
		if (!this.isString(value)) return Promise.reject(errorMessage);

		value = value.trim();

		if (!this.isEmail(value) || value.length > 30) return Promise.reject(errorMessage);

		return this.normalizeEmail(value);
	}

	async Password(value, errorMessage = 'Invalid password') {
		if (!this.isString(value) || value.length < 8 || value.length > 30) {
			return Promise.reject(errorMessage);
		}
		return value;
	}

	async Username(value, errorMessage = 'Invalid username') {
		if (!this.isString(value)) return Promise.reject(errorMessage);

		value = value.trim();

		if (value.length < 3 || value.length > 20 || !/^[a-zA-Z0-9._]+$/.test(value)) {
			return Promise.reject(errorMessage);
		}

		return value;
	}

	isString(value) {
		return typeof value === 'string';
	}
}

module.exports = new Validate(isEmail, normalizeEmail);
