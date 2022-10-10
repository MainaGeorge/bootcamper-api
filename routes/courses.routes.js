const router = require('express').Router({mergeParams: true});
const shaperMiddleware = require('../middleware/res.shaper.middleware');
const Course = require('../models/course.model');
const {protect, restrictToRole} = require('../controllers/auth.controller');
const {getCourses, getCourse, updateCourse, deleteCourse, createCourse} = require('../controllers/courses.controller');

router.route('/')
    .get(shaperMiddleware(Course, {
        path: 'bootcamp',
        select: 'name averageCost'
    }), getCourses)
    .post(protect, restrictToRole('admin', 'publisher'), createCourse);

router.route('/:id')
    .get(getCourse)
    .patch(protect, restrictToRole('admin', 'publisher'), updateCourse)
    .delete(protect, restrictToRole('admin', 'publisher'), deleteCourse)

module.exports = router;

