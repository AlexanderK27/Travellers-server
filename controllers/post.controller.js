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

async function deletePost(req, res) {
	const user_id = req.session.user.user_id;
	const post_id = PostValidator.toZeroNaturalOrNull(req.params.id);

	try {
		if (!post_id) {
			return res.status(400).json({ error: 'This post has already been deleted or never existed' });
		}

		await postService.deletePost(user_id, post_id);

		res.sendStatus(204);
	} catch (error) {
		if (!error.status || error.message === 'Unkown error') {
			res.status(500).json({ error: 'Something went wrong. Please try again later.' });
		} else {
			res.status(error.status).json({ error: error.message });
		}
	}
}

module.exports = {
	create,
	deletePost
};
