module.exports = class Validator {
	constructor() {}

	isString(value) {
		return typeof value === 'string';
	}

	toStringArrayOrNull(arr) {
		return !Array.isArray(arr) ? null : arr.filter(value => this.isString(value));
	}

	toZeroNaturalOrNull(value) {
		return isNaN(value) || value < 0 ? null : Math.round(value);
	}
};
