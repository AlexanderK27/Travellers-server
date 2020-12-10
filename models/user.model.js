const db = require('../db');

async function checkEmail(email) {
	try {
		const response = await db.query('SELECT user_email FROM users WHERE user_email = $1', [email]);
		return response.rows[0] && Promise.reject('email exists');
	} catch (error) {
		console.log('getEmail', error.message);
		Promise.reject('Unknown error');
	}
}

async function checkUsername(username) {
	try {
		const response = await db.query('SELECT username FROM users WHERE username = $1', [username]);
		return response.rows[0] && Promise.reject('username exists');
	} catch (error) {
		console.log('getUsername', error.message);
		Promise.reject('Unknown error');
	}
}

async function create(username, email, password) {
	try {
		const response = await db.query(
			'INSERT INTO users (username, user_email, user_password) VALUES ($1, $2, $3) RETURNING user_id',
			[username, email, password]
		);
		return response.rows[0] || Promise.reject('unable to create user');
	} catch (error) {
		console.log('create', error.message);
		Promise.reject('Unknown error');
	}
}

async function findByEmail(email) {
	try {
		const response = await db.query(
			`
				SELECT user_id, username, user_password
				FROM users 
				WHERE user_email = $1
			`,
			[email]
		);
		return response.rows[0] || Promise.reject('user not found');
	} catch (error) {
		console.log('findUserByEmail', error.message);
		Promise.reject('Unknown error');
	}
}

async function getLikedDislikedPosts(user_id) {
	try {
		const response = await db.query(
			`
			SELECT liked_posts, disliked_posts
			FROM users
			WHERE user_id = $1
		`,
			[user_id]
		);

		if (!response.rows[0]) return Promise.reject('Unable to find user');

		return {
			liked_posts: response.rows[0].liked_posts || [],
			disliked_posts: response.rows[0].disliked_posts || []
		};
	} catch (error) {
		console.log('getLikedDislikedPosts', error.message);
		Promise.reject('Unknown error');
	}
}

async function updateLikedDislikedPosts(user_id, liked_posts, disliked_posts) {
	try {
		const response = await db.query(
			`
			UPDATE users
			SET liked_posts = $1, disliked_posts = $2
			WHERE user_id = $3
			RETURNING user_id
		`,
			[liked_posts, disliked_posts, user_id]
		);

		return response.rows[0] || Promise.reject('Unable to find user');
	} catch (error) {
		console.log('updateLikedDislikedPosts', error.message);
		Promise.reject('Unknown error');
	}
}

module.exports = {
	checkEmail,
	checkUsername,
	create,
	findByEmail,
	getLikedDislikedPosts,
	updateLikedDislikedPosts
};
