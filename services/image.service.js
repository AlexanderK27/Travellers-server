const AWS = require('aws-sdk');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});

const S3 = new AWS.S3();

const image_dimentions = {
	avatar: { width: 480, height: 480 },
	minAvatar: { width: 36, height: 36 },
	poster: { width: 640, height: 480 }
};

const requestParams = {
	Bucket: process.env.S3_BUCKET_NAME
};

async function resizeImage(buffer, type) {
	const width = image_dimentions[type].width;
	const height = image_dimentions[type].height;
	return await sharp(buffer).resize(width, height).jpeg().toBuffer();
}

async function uploadImage(buffer, folderName, fileName = uuidv4()) {
	const params = {
		...requestParams,
		ContentType: 'image/jpeg',
		Key: folderName + '/' + fileName + '.jpg',
		Body: buffer
	};

	try {
		await S3.upload(params).promise();
		return fileName;
	} catch (e) {
		console.log('Error occurred during uploading image:', e.message);
		return Promise.reject({ status: 500, message: 'Unable to upload an image' });
	}
}

module.exports = {
	getImage,
	resizeImage,
	uploadImage
};
