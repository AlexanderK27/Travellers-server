const postModel = require('../models/post.model');

/****************************/
/***** PUBLIC FUNCTIONS *****/

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
		await checkAuthorByPostId(user_id, post_id);
		await postModel.deletePost(post_id);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function updateStatus(user_id, post_id, status_id) {
	try {
		await checkAuthorByPostId(user_id, post_id);
		return await postModel.updateStatus(post_id, status_id);
	} catch (error) {
		return Promise.reject(error);
	}
}

/***** END OF PUBLIC FUNCTIONS *****/
/***********************************/

/*****************************/
/***** PRIVATE FUNCTIONS *****/

async function checkAuthorByPostId(user_id, post_id) {
	try {
		const author_id = await postModel.getAuthorId(post_id);

		if (user_id !== author_id) {
			return Promise.reject({ status: 401, message: 'You are not the author of this post' });
		}
	} catch (error) {
		return Promise.reject(error);
	}
}

/***** END OF PRIVATE FUNCTIONS *****/
/************************************/

module.exports = {
	create,
	deletePost,
	updateStatus
};
