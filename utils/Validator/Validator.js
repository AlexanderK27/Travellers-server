module.exports = class Validator {
	constructor() {}

	isString(value) {
		return typeof value === 'string';
	}
};
