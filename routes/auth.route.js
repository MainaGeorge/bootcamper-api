const router = require('express').Router();
const {registerUser, login} = require('../controllers/auth.controller');
const {protect, getMe, forgotPassword, resetPassword} = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', protect, getMe)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:resetToken', resetPassword)


module.exports = router;