const authService = require('../services/auth.service');
const UserValidator = require('../utils/Validator/UserValidator');

async function checkUsername(req, res) {
	try {
		const username = await UserValidator.username(req.params.username, 'validation');

		await authService.checkUsername(username);

		res.status(200).json({ message: 'Free' });
	} catch (error) {
		if (error === 'validation') {
			res.status(400).json({ error: 'Invalid username' });
		} else {
			res.status(200).json({ message: 'Taken' });
		}
	}
}

async function login(req, res) {
	let { email, password } = req.body;

	// validation
	try {
		email = await UserValidator.email(email);
		password = await UserValidator.password(password);
	} catch (error) {
		return res.status(400).json({ error: 'Invalid email or password' });
	}

	// logging in
	try {
		const user = await authService.login(email, password);
		req.session.user = user;
		res.status(200).json({ payload: { username: user.username } });
	} catch (error) {
		res.status(400).json({ error: 'Invalid email or password' });
	}
}

async function signup(req, res) {
	let { username, email, password } = req.body;

	// validation
	try {
		username = await UserValidator.username(username, 'username');
		email = await UserValidator.email(email);
		password = await UserValidator.password(password);
	} catch (error) {
		res.status(400);

		if (error === 'username') {
			return res.json({ error: 'Invalid username' });
		} else {
			return res.json({ error: 'Invalid email or password' });
		}
	}

	// creating new user
	try {
		const user_id = await authService.signup(username, email, password);

		req.session.user = { user_id };
		res.status(201).json({ message: 'Account has been created' });
	} catch (error) {
		if (error === 'username exists') {
			res.status(400).json({ error: 'Sorry, username is taken by another user' });
		} else if (error === 'email exists') {
			res.status(400).json({ error: 'Invalid email or password' });
		} else {
			res.status(500).json({ error: 'Something went wrong. Please, try again later.' });
		}
	}
}

module.exports = {
	checkUsername,
	login,
	signup
};
