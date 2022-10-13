const router = require('express').Router();
const {protect, restrictToRole} = require('../controllers/auth.controller');
const {createUser, updateUser, deleteUser, getUser, getUsers} = require('../controllers/admin.controller');
const shaperMiddleware = require('../middleware/res.shaper.middleware');
const User = require('../models/user.model')

router.use(protect, restrictToRole('admin'));

router
    .route('/')
    .get(shaperMiddleware(User), getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;