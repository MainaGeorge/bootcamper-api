const asyncErrorWrapper = require('../utils/async.error.wrapper');
const AppError = require('../utils/custom.error');
const Course = require('../models/course.model');
const Bootcamp = require('../models/bootcamp.model');

module.exports.getCourses = asyncErrorWrapper(async (req, res, next) => {
    const {bootCampId} = req.params;

    if (bootCampId) {
        let courses = await Course.find({bootcamp: bootCampId}).populate({
            path: 'bootcamp',
            select: 'name averageCost'
        })
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: {
                data: courses
            }
        })
    }

    return res.status(200).json({
        success: true,
        data: res.shapedData
    })
});

module.exports.getCourse = asyncErrorWrapper(async function (req, res, next) {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError(`No course found with the id ${req.params.id}`, 400));

    return res.status(200).json({
        success: true,
        data: {
            data: course
        }
    })
})

module.exports.updateCourse = asyncErrorWrapper(async function (req, res, next) {
    let course = await Course.findById(req.params.id);
    const userId = req.user.id

    if (!course) return next(new AppError(`No course found with the id ${req.params.id}`, 400));

    if(course.user !== userId && req.user.role !== 'admin'){
        return next(new AppError(`user ${userId} is not allowed to update resource ${req.params.id}`, 403));
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    return res.status(200).json({
        success: true,
        data: {
            data: course
        }
    })
})

module.exports.deleteCourse = asyncErrorWrapper(async function (req, res, next) {
    const userId = req.user.id
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError(`No course found with the id ${req.params.id}`, 400));

    if(course.user !== userId && req.user.role !== 'admin'){
        return next(new AppError(`user ${userId} is not allowed to update resource ${req.params.id}`, 403));
    }
    course.remove();
    return res.status(204).json({
        success: true,
        data: {
            data: course
        }
    })
})

module.exports.createCourse = asyncErrorWrapper(async function (req, res, next) {
    const {bootCampId} = req.params;
    const bootcamp = await Bootcamp.findById(bootCampId);
    const userId = req.user.id;

    if (!bootcamp) return next(new AppError(`No bootcamp found with the id ${req.params.id}`, 400));
    if(bootcamp.user !== userId && req.user.role !== 'admin'){
        return next(new AppError(`user ${userId} is not allowed to create resources in this bootcamp`, 403));
    }

    req.body.bootcamp = bootcamp;
    const course = await Course.create(req.body);
    res.status(201).json({success: true, data: {data: course}});
})