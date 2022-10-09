const asyncErrorWrapper = require('../utils/async.error.wrapper');
const AppError = require('../utils/custom.error');
const Course = require('../models/course.model');
const Bootcamp = require('../models/bootcamp.model');

module.exports.getCourses = asyncErrorWrapper(async (req, res, next) => {
    let query = Course.find();
    const {bootCampId} = req.params;

    if(bootCampId) query = query.find({bootcamp: bootCampId});

    const courses = await query;
    return res.status(200).json({
        success: true,
        count: courses.length,
        data: {
            data: courses
        }
    })
});

module.exports.getCourse = asyncErrorWrapper(async function(req, res, next){
    const course = await Course.findById(req.params.id);
    if(!course) return next(new AppError(`No course found with the id ${req.params.id}`, 400));

    return res.status(200).json({
        success: true,
        data: {
            data: course
        }
    })
})

module.exports.updateCourse = asyncErrorWrapper(async function(req, res, next){
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        data: {
            data: course
        }
    })
})

module.exports.deleteCourse = asyncErrorWrapper(async function(req, res, next){
    const course = await Course.findById(req.params.id);
    if(!course) return next(new AppError(`No course found with the id ${req.params.id}`, 400));

    course.remove();
    return res.status(204).json({
        success: true,
        data: {
            data: course
        }
    })
})

module.exports.createCourse = asyncErrorWrapper(async function(req, res, next){
    const {bootCampId} = req.params;
    const bootcamp = await Bootcamp.findById(bootCampId);

    if(!bootcamp) return next(new AppError(`No bootcamp found with the id ${req.params.id}`, 400));
    req.body.bootcamp = bootcamp;

    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: {data: course }});
})