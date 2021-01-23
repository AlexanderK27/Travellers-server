const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/check/:username', authController.checkUsername);
router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.use(authMiddleware);

router.patch('/email', authController.changeEmail);
router.patch('/password', authController.changePassword);

module.exports = router;
