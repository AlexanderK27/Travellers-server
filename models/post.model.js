const db = require('../db');

async function create(author_id, posterURL, post_text, title, filters) {
	const { amount_of_cities, amount_of_countries, amount_of_people, amount_of_days, budget, city, continent, country } =
		filters || {};

	try {
		const response = await db.query(
			`
        INSERT INTO posts
        (author_id, poster, post_text, title, amount_of_cities, amount_of_countries, 
          amount_of_people, amount_of_days, budget, city, continent, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING post_id
      `,
			[
				author_id,
				posterURL,
				post_text,
				title,
				amount_of_cities,
				amount_of_countries,
				amount_of_people,
				amount_of_days,
				budget,
				city,
				continent,
				country
			]
		);

		return response.rows[0] || Promise.reject('Insert error');
	} catch (error) {
		console.log('post model create error:', error.message);
		return Promise.reject('Unknown error');
	}
}

module.exports = {
	create
};
