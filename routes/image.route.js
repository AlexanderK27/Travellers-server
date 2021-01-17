const { Router } = require('express');
const imageController = require('../controllers/image.controller');

const router = Router();

router.get('/avatar/:id', imageController.getAvatar);
router.get('/avatar-min/:id', imageController.getMinAvatar);
router.get('/poster/:id', imageController.getPoster);

module.exports = router;
