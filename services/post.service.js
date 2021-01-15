const postModel = require('../models/post.model');
const userModel = require('../models/user.model');

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

async function getMyPosts(user_id) {
	try {
		return await postModel.getMyPosts(user_id);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getPost(post_id, user_id) {
	try {
		if (!user_id) {
			return await postModel.getPublishedPost(post_id);
		}

		const author_id = await postModel.getAuthorId(post_id);

		if (user_id === author_id) {
			return await postModel.getPost(post_id);
		} else {
			return await postModel.getPublishedPost(post_id);
		}
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

async function likeDislike(user_id, post_id, isLike) {
	try {
		const ids = await userModel.getLikedDislikedPosts(user_id);
		const { liked_posts, disliked_posts, like, dislike } = handleLikeDislike(post_id, ids, isLike);

		// update post and user
		const likesDislikes = await postModel.updateLikesDislikes(post_id, like, dislike);
		await userModel.updateLikedDislikedPosts(user_id, liked_posts, disliked_posts);

		return likesDislikes;
	} catch (error) {
		return Promise.reject(error);
	}
}

/***** END OF PUBLIC FUNCTIONS *****/

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

function handleLikeDislike(post_id, post_ids, isLike) {
	const result = {
		liked_posts: undefined,
		disliked_posts: undefined,
		like: undefined,
		dislike: undefined
	};

	// 1. create variables with values equal to result object keys
	// if user liked post - primary array (arr1) = liked_posts, interger (int1) = likes
	const arr1 = isLike ? 'liked_posts' : 'disliked_posts';
	const arr2 = !isLike ? 'liked_posts' : 'disliked_posts';
	const int1 = isLike ? 'like' : 'dislike';
	const int2 = !isLike ? 'like' : 'dislike';

	// 2. check if primary array contains post_id - remove if so, add if not
	// 3. assign values to primary fields of result object
	if (post_ids[arr1].includes(post_id)) {
		result[arr1] = post_ids[arr1].filter(id => id !== post_id);
		result[int1] = -1;
	} else {
		result[arr1] = [...post_ids[arr1], post_id];
		result[int1] = 1;
	}

	// 4. check if secondary array contains post_id - remove if so, do nothing if not
	// 5. assign values to secondary fields of result object
	if (post_ids[arr2].includes(post_id)) {
		result[arr2] = post_ids[arr2].filter(id => id !== post_id);
		result[int2] = -1;
	} else {
		result[arr2] = [...post_ids[arr2]];
		result[int2] = 0;
	}

	return result;
}

/***** END OF PRIVATE FUNCTIONS *****/

module.exports = {
	create,
	deletePost,
	getMyPosts,
	getPost,
	likeDislike,
	updateStatus
};
