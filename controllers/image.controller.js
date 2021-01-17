const { validate: isUuid } = require('uuid');
const { getImage } = require('../services/image.service');
const errorConverter = require('../utils/errorConverter');

async function handleImageRequest(req, res, folderName) {
	const fileName = req.params.id;

	if (!isUuid(fileName)) {
		return res.status(400).json({ error: 'Invalid path' });
	}

	try {
		const image = await getImage(folderName, fileName);

		res.set('Content-Type', 'image/jpg');
		return res.status(200).send(image);
	} catch (error) {
		const { status, message } = errorConverter(error);
		return res.status(status).json({ error: message });
	}
}

async function getAvatar(req, res) {
	return await handleImageRequest(req, res, 'avatar');
}

async function getMinAvatar(req, res) {
	return await handleImageRequest(req, res, 'avatar-min');
}

async function getPoster(req, res) {
	return await handleImageRequest(req, res, 'poster');
}

module.exports = {
	getAvatar,
	getMinAvatar,
	getPoster
};
