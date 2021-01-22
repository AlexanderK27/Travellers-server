const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = Router();

router.post('/follow', userController.followAuthor);

router.use(authMiddleware);

router.delete('/account', userController.deleteAccount);
router.get('/author/:username', userController.getAuthorProfile);
router.get('/profile', userController.getMyProfile);
router.patch('/profile', userController.setProfileData);

module.exports = router;
