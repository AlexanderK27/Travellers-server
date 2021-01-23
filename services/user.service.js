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

async function followAuthor(author_username, followings, user_id) {
	try {
		const author_id = await userModel.getIdByUsername(author_username);
		const iFollow = followings.includes(author_id);

		if (iFollow) {
			followings = followings.filter(id => id !== author_id);
		} else {
			followings.push(author_id);
		}

		await userModel.updateFollowings(user_id, followings);
		await userModel.updateFollowers(author_id, user_id, iFollow);

		return followings;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getAuthorProfile(author_username, user_followings) {
	try {
		const profile = await userModel.getAuthorProfile(author_username);
		const { user_id, ...profileData } = profile;

		profileData.iFollow = user_followings.includes(profile.user_id);
		profileData.followings = profile.followings.length;
		profileData.followers = profile.followers.length;

		const posts = await postModel.getAuthorPosts(user_id);

		return { profile: profileData, posts };
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

async function saveAvatar(user_id, avatar) {
	let avFileName = null;

	try {
		const resAvatar = await imageService.resizeImage(avatar, 'avatar');
		const minAvatar = await imageService.resizeImage(avatar, 'minAvatar');

		avFileName = await imageService.uploadImage(resAvatar, 'avatar');
		await imageService.uploadImage(minAvatar, 'avatar-min', avFileName);

		await userModel.saveAvatar(user_id, avFileName);

		return avFileName;
	} catch (error) {
		console.log('saveAvatar ERROR:', error);
		return Promise.reject(error);
	}
}

async function saveProfileData(user_id, bio, contact, real_name) {
	try {
		await userModel.saveProfileData(user_id, bio, contact, real_name);
	} catch (error) {
		console.log('saveProfileData ERROR:', error);
		return Promise.reject(error);
	}
}

module.exports = {
	deleteAccount,
	followAuthor,
	getAuthorProfile,
	getMyProfile,
	saveAvatar,
	saveProfileData
};
