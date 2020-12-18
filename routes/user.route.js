const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = Router();

router.use(authMiddleware);

router.delete('/account', userController.deleteAccount);

module.exports = router;
