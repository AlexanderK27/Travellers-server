const postModel = require('../models/post.model');
const postService = require('../services/post.service');
const PostValidator = require('../utils/Validator/PostValidator');
const errorConverter = require('../utils/errorConverter');

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

	if (!post_id) {
		return res.status(400).json({ error: 'This post has already been deleted or never existed' });
	}

	try {
		await postService.deletePost(user_id, post_id);
		res.sendStatus(204);
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

async function getPost(req, res) {
	const post_id = PostValidator.toZeroNaturalOrNull(req.params.id);
	const user_id = req.session.user && req.session.user.user_id;

	if (!post_id) {
		return res.status(400).json({ error: 'Invalid identifier' });
	}

	try {
		const post = await postService.getPost(post_id, user_id);
		res.status(200).json({ payload: post });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

async function updateStatus(req, res) {
	const post_id = PostValidator.toZeroNaturalOrNull(req.body.post_id);
	const status_id = req.body.status_id;
	const user_id = req.session.user.user_id;

	if (!post_id || !postModel.types.post_status[status_id]) {
		return res.status(400).json({ error: 'Unable to change post status' });
	}

	try {
		const status = await postService.updateStatus(user_id, post_id, status_id);
		res.status(200).json({ message: `Post has been ${status}` });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

async function ratePost(req, res) {
	const user_id = req.session.user.user_id;
	const post_id = PostValidator.toZeroNaturalOrNull(req.body.post_id);
	// user can either like post or dislike, by default let it be like
	const isLike = !req.body.dislike;

	if (!post_id) {
		return res.status(404).json({ error: 'Post not found' });
	}

	try {
		const likesAndDislikes = await postService.likeDislike(user_id, post_id, isLike);
		res.status(200).json({ payload: likesAndDislikes });
	} catch (error) {
		const { status, message } = errorConverter(error);
		res.status(status).json({ error: message });
	}
}

module.exports = {
	create,
	deletePost,
	getPost,
	ratePost,
	updateStatus
};
