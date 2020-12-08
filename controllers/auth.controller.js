const authService = require('../services/auth.service');
const Validate = require('../utils/Validate');

async function checkUsername(req, res) {
	try {
		const username = await Validate.Username(req.params.username, 'validation');

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

async function signup(req, res) {
	let { username, email, password } = req.body;

	// validation
	try {
		username = await Validate.Username(username, 'username');
		email = await Validate.Email(email);
		password = await Validate.Password(password);
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
	signup
};
