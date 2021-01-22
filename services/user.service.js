const userModel = require('../models/user.model');
const postModel = require('../models/post.model');
const imageService = require('./image.service');

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
		user.user_id = user_id;

		const posts = await postModel.getAmountOfUsersPosts(user_id);
		user.posts = +posts;

		const dataForUser = {
			...user,
			followings: user.followings.length,
			followers: user.followers.length
		};

		return { user, dataForUser };
	} catch (error) {
		return Promise.reject(error);
	}
}

async function saveProfileData(user_id, avatar, bio, contact, real_name) {
	let avFileName = null;

	try {
		if (avatar) {
			const resAvatar = await imageService.resizeImage(avatar, 'avatar');
			const minAvatar = await imageService.resizeImage(avatar, 'minAvatar');

			avFileName = await imageService.uploadImage(resAvatar, 'avatar');
			await imageService.uploadImage(minAvatar, 'avatar-min', avFileName);
		}

		await userModel.saveProfileData(user_id, avFileName, bio, contact, real_name);
		return avFileName;
	} catch (error) {
		console.log('saveProfileData ERROR:', error);
		return Promise.reject(error);
	}
}

module.exports = {
	deleteAccount,
	getMyProfile,
	saveProfileData
};
