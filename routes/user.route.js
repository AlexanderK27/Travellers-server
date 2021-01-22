const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = Router();

router.use(authMiddleware);

router.delete('/account', userController.deleteAccount);
router.get('/profile', userController.getMyProfile);
router.patch('/profile', userController.setProfileData);

module.exports = router;
