const userModel = require('../models/user.model');
const postModel = require('../models/post.model');

async function deleteAccount(user_id) {
	try {
		return await userModel.deleteAccount(user_id);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getMyProfile(user_id) {
	try {
		const user = await userModel.getMyProfileData(user_id);
		const posts = await postModel.getMyPosts(user_id);

		return { user, posts };
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = {
	deleteAccount,
	getMyProfile
};
