const router = require('express').Router();
const {registerUser, login} = require('../controllers/auth.controller');
const {protect, getMe} = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', protect, getMe)


module.exports = router;