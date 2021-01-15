const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const postController = require('../controllers/post.controller');

const router = Router();

router.get('/one/:id', postController.getPost);

router.use(authMiddleware);

router.get('/my', postController.getMyPosts);
router.post('/create', postController.create);
router.patch('/rate', postController.ratePost);
router.patch('/status', postController.updateStatus);
router.delete('/one/:id', postController.deletePost);

module.exports = router;
