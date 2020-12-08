const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.get('/check/:username', authController.checkUsername);
router.post('/login', authController.login);
router.post('/signup', authController.signup);

module.exports = router;
