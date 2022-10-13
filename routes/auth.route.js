const router = require('express').Router();
const {registerUser, login} = require('../controllers/auth.controller');
const {protect, getMe, forgotPassword, resetPassword, updatePassword} = require('../controllers/auth.controller');

router.get('/me', protect, getMe)
router.post('/register', registerUser);
router.post('/login', login);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:resetToken', resetPassword)
router.post('/update-password', protect, updatePassword)

module.exports = router;