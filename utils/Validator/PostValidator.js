const isBase64 = require('validator/lib/isBase64');
const Validator = require('./Validator');

class PostValidator extends Validator {
	constructor(isBase64, options) {
		super(options);

		this.isBase64 = isBase64;
	}

	async filters(filters, errorMessage = 'Invalid filters format') {
		if (!filters || filters.toString() !== '[object Object]' || !Object.keys(filters).length) {
			return null;
		}

		return {
			amount_of_cities: this.toZeroNaturalOrNull(filters.amount_of_cities),
			amount_of_countries: this.toZeroNaturalOrNull(filters.amount_of_countries),
			amount_of_people: this.toZeroNaturalOrNull(filters.amount_of_people),
			amount_of_days: this.toZeroNaturalOrNull(filters.amount_of_days),
			budget: this.toZeroNaturalOrNull(filters.budget),
			city: this.toStringArrayOrNull(filters.city),
			continent: this.toStringArrayOrNull(filters.continent),
			country: this.toStringArrayOrNull(filters.country)
		};
	}

	async posterBase64(poster, errorMessage = 'Invalid poster format') {
		if (!poster) return '';

		return this.isBase64('' + poster) ? poster : Promise.reject(errorMessage);
	}

	async postText(text, errorMessage = 'Invalid post text') {
		if (!this.isString(text)) return Promise.reject(errorMessage);

		text = text.trim();

		return text ? text : Promise.reject(errorMessage);
	}

	async title(title, errorMessage = 'Invalid post title') {
		if (!this.isString(title) || !title.trim()) {
			return Promise.reject(errorMessage);
		}
		return title.trim();
	}
}

module.exports = new PostValidator(isBase64);
