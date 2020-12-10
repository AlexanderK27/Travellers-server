const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const postController = require('../controllers/post.controller');

const router = Router();

router.use(authMiddleware);

router.post('/create', postController.create);
router.patch('/rate', postController.ratePost);
router.patch('/status', postController.updateStatus);
router.delete('/:id', postController.deletePost);

module.exports = router;
