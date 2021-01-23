const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

async function checkUsername(username) {
	try {
		await userModel.checkUsername(username);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function login(email, password) {
	try {
		const { user_id, username, user_password } = await userModel.findByEmail(email);

		const match = await bcrypt.compare(password, user_password);

		if (match) {
			return { user_id, username };
		} else {
			return Promise.reject('Invalid email or password');
		}
	} catch (error) {
		return Promise.reject('User not found');
	}
}

async function signup(username, email, password) {
	try {
		await userModel.checkUsername(username);
		await userModel.checkEmail(email);

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await userModel.create(username, email, hashedPassword);
		user.username = username;
		user.posts = 0;

		const { user_id, ...dataForUser } = user;

		dataForUser.followings = dataForUser.followings.length;
		dataForUser.followers = dataForUser.followers.length;

		return { user, dataForUser };
	} catch (error) {
		return Promise.reject(error);
	}
}

async function updateEmail(user_id, email) {
	try {
		await userModel.checkEmail(email);
		await userModel.updateEmail(user_id, email);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = {
	checkUsername,
	login,
	signup,
	updateEmail
};
