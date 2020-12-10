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

async function deletePost(post_id) {
	try {
		const response = await db.query('DELETE FROM posts WHERE post_id = $1 RETURNING post_id', [post_id]);

		return (
			response.rows[0] ||
			Promise.reject({
				status: 400,
				message: 'This post has already been deleted or never existed'
			})
		);
	} catch (error) {
		console.log('post model deletePost error:', error.message);
		return Promise.reject({ status: 500, message: 'Unknown error' });
	}
}

async function getAuthorId(post_id) {
	try {
		const response = await db.query('SELECT author_id FROM posts WHERE post_id = $1', [post_id]);

		return response.rows[0]
			? response.rows[0].author_id
			: Promise.reject({ status: 400, message: 'This post was deleted or never existed' });
	} catch (error) {
		console.log('post model getAuthorId error:', error.message);
		return Promise.reject({ status: 500, message: 'Unknown error' });
	}
}

module.exports = {
	create,
	deletePost,
	getAuthorId
};
