const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const postController = require('../controllers/post.controller');

const router = Router();

router.post('/create', authMiddleware, postController.create);

module.exports = router;
