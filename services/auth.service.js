const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

async function checkUsername(username) {
	try {
		return await userModel.checkUsername(username);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function signup(username, email, password) {
	try {
		await userModel.checkUsername(username);
		await userModel.checkEmail(email);

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await userModel.create(username, email, hashedPassword);

		return user.user_id;
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = {
	checkUsername,
	signup
};
