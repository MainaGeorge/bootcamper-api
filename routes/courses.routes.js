const router = require('express').Router({mergeParams: true});
const {getCourses, getCourse, updateCourse, deleteCourse, createCourse} = require('../controllers/courses.controller');

router.route('/')
    .get(getCourses)
    .post(createCourse);

router.route('/:id')
    .get(getCourse)
    .patch(updateCourse)
    .delete(deleteCourse)

module.exports = router;

