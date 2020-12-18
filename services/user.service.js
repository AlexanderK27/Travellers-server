const userModel = require('../models/user.model');

async function deleteAccount(user_id) {
	try {
		return await userModel.deleteAccount(user_id);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = {
	deleteAccount
};
