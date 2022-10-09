const router = require('express').Router();
const {registerUser} = require('../controllers/auth.controller');

router.use('/register', registerUser);


module.exports = router;