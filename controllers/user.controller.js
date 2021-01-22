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
	const user_id = req.session.user.user_id;
	let { avatar, bio, contact, real_name } = req.body;

	// validation
	try {
		avatar = await UserValidator.isBase64(avatar, 'Invalid avatar format');
		bio = await UserValidator.bio(bio);
		contact = await UserValidator.contact(contact);
		real_name = await UserValidator.real_name(real_name);
	} catch (error) {
		return res.status(400).json({ error: error.message || error });
	}

	avatar = UserValidator.toBufferOrNull(avatar);

	// saving profile data
	try {
		const avatarFileName = await userService.saveProfileData(user_id, avatar, bio, contact, real_name);

		res.status(201).json({ message: 'Profile data has been saved', payload: avatarFileName });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

module.exports = {
	deleteAccount,
	getAuthorProfile,
	getMyProfile,
	setProfileData
};
