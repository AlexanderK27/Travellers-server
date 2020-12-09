const { Router } = require('express');
const postController = require('../controllers/post.controller');

const router = Router();

router.post('/create', postController.create);

module.exports = router;
