const postService = require('../services/post.service');
const PostValidator = require('../utils/Validator/PostValidator');

async function create(req, res) {
	const author_id = req.session.user.user_id;
	let { poster, post_text, title, filters } = req.body;

	// validation
	try {
		poster = await PostValidator.posterBase64(poster, 'Invalid poster format');
		post_text = await PostValidator.postText(post_text, 'Invalid text');
		title = await PostValidator.title(title, 'Invalid title');
		filters = await PostValidator.filters(filters);
	} catch (error) {
		return res.status(400).json({ error });
	}

	// saving new post
	try {
		await postService.create(author_id, poster, post_text, title, filters);

		res.status(201).json({ message: 'Post has been created' });
	} catch (error) {
		if (error === 'Insert error') {
			res.status(500).json({ error: 'Unable to create new post' });
		} else {
			res.status(500).json({ error: 'Something went wrong. Please try again later.' });
		}
	}
}

module.exports = {
	create
};
