const postModel = require('../models/post.model');

async function create(author_id, poster, post_text, title, filters) {
	try {
		// TODO:
		// call service to insert poster to the file system and to get url
		const posterURL = '';

		await postModel.create(author_id, posterURL, post_text, title, filters);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function deletePost(user_id, post_id) {
	try {
		const author_id = await postModel.getAuthorId(post_id);

		if (user_id !== author_id) {
			return Promise.reject({ status: 401, message: 'You are not the author of this post' });
		}

		await postModel.deletePost(post_id);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = {
	create,
	deletePost
};
