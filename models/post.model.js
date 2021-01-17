const db = require('../db');

const postNotFoundMessage = 'This post was deleted or never existed';

const types = {
	post_status: {
		1: 'created',
		2: 'published',
		3: 'hidden'
	}
};

async function create(author_id, posterFileName, post_text, title, filters) {
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
				posterFileName,
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
				status: 404,
				message: postNotFoundMessage
			})
		);
	} catch (error) {
		console.log('post model deletePost error:', error.message);
		return Promise.reject({ status: 500, message: 'Unknown error' });
	}
}

async function getAmountOfUsersPosts(user_id) {
	try {
		const response = await db.query('SELECT COUNT(post_id) FROM posts WHERE author_id = $1', [user_id]);
		return response.rows[0].count;
	} catch (error) {
		console.log('post model getAmountOfUsersPosts error:', error.message);
		return Promise.reject('Unknown error');
	}
}

async function getAuthorId(post_id) {
	try {
		const response = await db.query('SELECT author_id FROM posts WHERE post_id = $1', [post_id]);

		return response.rows[0]
			? response.rows[0].author_id
			: Promise.reject({ status: 404, message: postNotFoundMessage });
	} catch (error) {
		console.log('post model getAuthorId error:', error.message);
		return Promise.reject({ status: 500, message: 'Unknown error' });
	}
}

async function getMyPosts(user_id) {
	try {
		const response = await db.query(
			`
			SELECT post_id, post_created_at, poster, post_status, title
			FROM posts
			WHERE author_id = $1
			ORDER BY post_created_at DESC
		`,
			[user_id]
		);

		return response.rows;
	} catch (error) {
		console.log('post model getMyPosts error:', error.message);
		return Promise.reject('Unknown error');
	}
}

async function getPost(post_id) {
	try {
		const response = await db.query('SELECT * FROM posts WHERE post_id = $1', [post_id]);
		return response.rows[0] || Promise.reject({ status: 404, message: postNotFoundMessage });
	} catch (error) {
		console.log('post model getPublishedPost error:', error.message);
		return Promise.reject({ status: 500, message: 'Unknown error' });
	}
}

async function getPublishedPost(post_id) {
	try {
		const response = await db.query(
			`
			SELECT *
			FROM posts 
			WHERE post_id = $1 AND post_status = 'published'
		`,
			[post_id]
		);

		return response.rows[0] || Promise.reject({ status: 404, message: postNotFoundMessage });
	} catch (error) {
		console.log('post model getPublishedPost error:', error.message);
		return Promise.reject({ status: 500, message: 'Unknown error' });
	}
}

async function updateStatus(post_id, status_id) {
	const status = types.post_status[status_id];

	try {
		const response = await db.query(
			`
			UPDATE posts 
			SET post_status = $1 
			WHERE post_id = $2 
			RETURNING post_status	
		`,
			[status, post_id]
		);

		return response.rows[0]
			? response.rows[0].post_status
			: Promise.reject({ status: 404, message: postNotFoundMessage });
	} catch (error) {
		console.log('post model getAuthorId error:', error.message);
		return Promise.reject({ status: 500, message: 'Unknown error' });
	}
}

async function updateLikesDislikes(post_id, like, dislike) {
	try {
		const response = await db.query(
			`
			UPDATE posts
			SET likes = likes + $1, dislikes = dislikes + $2
			WHERE post_id = $3
			RETURNING likes, dislikes
		`,
			[like, dislike, post_id]
		);

		return response.rows[0] || Promise.reject('Unable to rate post');
	} catch (error) {
		console.log('post model updateLikesDisliked error:', error.message);
		return Promise.reject('Unknown error');
	}
}

module.exports = {
	create,
	deletePost,
	getAmountOfUsersPosts,
	getAuthorId,
	getMyPosts,
	getPost,
	getPublishedPost,
	updateLikesDislikes,
	updateStatus,
	types
};
