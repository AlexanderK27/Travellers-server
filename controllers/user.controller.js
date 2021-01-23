const { validate: isUuid } = require('uuid');
const userService = require('../services/user.service');
const errorConverter = require('../utils/errorConverter');
const UserValidator = require('../utils/Validator/UserValidator');

async function deleteAccount(req, res) {
	const user_id = req.session.user.user_id;

	try {
		const { status, message } = await userService.deleteAccount(user_id);
		res.status(status).json({ message });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

async function followAuthor(req, res) {
	const { user_id, followings } = req.session.user;

	try {
		const a_username = await UserValidator.username(req.body.username);

		const newFollowings = await userService.followAuthor(a_username, followings, user_id);

		req.session.user.followings = newFollowings;
		res.status(200).json({ payload: newFollowings.length });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

async function getAuthorProfile(req, res) {
	const followings = req.session.user ? req.session.user.followings : [];
	const author = req.params.username;

	try {
		const profileAndPosts = await userService.getAuthorProfile(author, followings);
		res.status(200).json({ payload: profileAndPosts });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

async function getMyProfile(req, res) {
	const user_id = req.session.user.user_id;

	try {
		const { user, dataForUser } = await userService.getMyProfile(user_id);
		req.session.user = { ...user };
		res.status(200).json({ payload: dataForUser });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

async function setProfileData(req, res) {
	const user = req.session.user;
	const user_id = user.user_id;
	let { avatar, bio, contact, real_name } = req.body;
	let avatarFileName = '';
	let anyProfData = false;
	let responseMsg;

	try {
		if (avatar && !isUuid(avatar)) {
			avatarFileName = await saveAvatar(user_id, avatar);
		}

		bio === undefined ? (bio = user.bio) : (anyProfData = true);
		contact === undefined ? (contact = user.contact) : (anyProfData = true);
		real_name === undefined ? (real_name = user.real_name) : (anyProfData = true);

		if (anyProfData) {
			await saveProfileData(user_id, { bio, contact, real_name });
			responseMsg = 'Profile data has been saved';
		} else {
			responseMsg = 'Avatar has been saved';
		}

		res.status(201).json({ message: responseMsg, payload: avatarFileName });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

async function saveAvatar(user_id, avatar) {
	const invalidAvatarMsg = 'Invalid avatar format';

	try {
		avatar = await UserValidator.isBase64(avatar, invalidAvatarMsg);
		avatar = UserValidator.toBufferOrNull(avatar);

		return await userService.saveAvatar(user_id, avatar);
	} catch (error) {
		if (error === invalidAvatarMsg) {
			return Promise.reject({ status: 400, message: invalidAvatarMsg });
		}
		return Promise.reject(error);
	}
}

async function saveProfileData(user_id, profileData) {
	let { bio, contact, real_name } = profileData;

	// validation
	try {
		bio = await UserValidator.bio(bio);
		contact = await UserValidator.contact(contact);
		real_name = await UserValidator.real_name(real_name);
	} catch (error) {
		return Promise.reject({ status: 400, message: error });
	}

	// saving profile data
	try {
		await userService.saveProfileData(user_id, bio, contact, real_name);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = {
	deleteAccount,
	followAuthor,
	getAuthorProfile,
	getMyProfile,
	setProfileData
};
