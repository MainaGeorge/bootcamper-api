const router = require('express').Router({mergeParams: true});
const shaperMiddleware = require('../middleware/res.shaper.middleware');
const Course = require('../models/course.model')
const {getCourses, getCourse, updateCourse, deleteCourse, createCourse} = require('../controllers/courses.controller');

router.route('/')
    .get(shaperMiddleware(Course, {
        path: 'bootcamp',
        select: 'name averageCost'
    }), getCourses)
    .post(createCourse);

router.route('/:id')
    .get(getCourse)
    .patch(updateCourse)
    .delete(deleteCourse)

module.exports = router;

