const router = require('express').Router({mergeParams: true});
const {getCourses} = require('../controllers/courses.controller');

router.route('/').get(getCourses);

module.exports = router;

