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

module.exports = {
	create
};
