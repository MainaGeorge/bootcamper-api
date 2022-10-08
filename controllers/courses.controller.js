const asyncErrorWrapper = require('../utils/async.error.wrapper');
const AppError = require('../utils/custom.error');
const Course = require('../models/course.model');

module.exports.getCourses = asyncErrorWrapper(async (req, res, next) => {
    let query = Course.find();
    const {bootCampId} = req.params;

    if(bootCampId){
        query = query.find({bootcamp: bootCampId});
    }

    const courses = await query;

    return res.status(200).json({
        success: true,
        count: courses.length,
        data: {
            data: courses
        }
    })
});