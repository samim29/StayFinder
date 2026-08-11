const express = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
	validateRegisterUser,
	validateLoginUser,
} = require('../validations/auth.validation');
const router = express.Router();

router.post('/register', validateRegisterUser, authController.registerUserController);
router.post('/login', validateLoginUser, authController.loginUserController);
router.post('/logout',authController.logoutUserController);
router.get('/profile', authMiddleware, authController.getUserProfileController);
module.exports = router;