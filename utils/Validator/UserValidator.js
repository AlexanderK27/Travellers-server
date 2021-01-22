const isEmail = require('validator/lib/isEmail');
const normalizeEmail = require('validator/lib/normalizeEmail');
const Validator = require('./Validator');

class UserValidator extends Validator {
	constructor() {
		super();
	}

	static async bio(value, errorMessage = 'Invalid bio') {
		if (!this.isString(value)) return Promise.reject(errorMessage);

		value = value.trim();

		if (value.length > 150) return Promise.reject('Bio is to long');
		return value;
	}

	static async contact(value, errorMessage = 'Invalid contact') {
		if (!this.isString(value)) return Promise.reject(errorMessage);

		value = value.trim();

		if (value.length > 50) return Promise.reject('Contact is to long');
		return value;
	}

	static async email(value, errorMessage = 'Invalid email') {
		if (!this.isString(value)) return Promise.reject(errorMessage);

		value = value.trim();

		if (!isEmail(value) || value.length > 30) return Promise.reject(errorMessage);

		return normalizeEmail(value);
	}

	static async password(value, errorMessage = 'Invalid password') {
		if (!this.isString(value) || value.length < 8 || value.length > 30) {
			return Promise.reject(errorMessage);
		}
		return value;
	}

	static async real_name(value, errorMessage = 'Invalid name') {
		if (!this.isString(value)) return Promise.reject(errorMessage);

		value = value.trim();

		if (value.length > 50) return Promise.reject('Name is to long');
		return value;
	}

	static async username(value, errorMessage = 'Invalid username') {
		if (!this.isString(value)) return Promise.reject(errorMessage);

		value = value.trim();

		if (!this.isUsernameValid(value)) return Promise.reject(errorMessage);

		return value;
	}
}

module.exports = UserValidator;
