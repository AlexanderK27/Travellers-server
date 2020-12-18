const userService = require('../services/user.service');
const errorConverter = require('../utils/errorConverter');

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

async function getMyProfile(req, res) {
	const user_id = req.session.user.user_id;

	try {
		const profile = await userService.getMyProfile(user_id);
		res.status(200).json({ payload: profile });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

module.exports = {
	deleteAccount,
	getMyProfile
};
