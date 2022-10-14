const Review = require('../models/reviews.model');
const asyncErrorWrapper = require('../utils/async.error.wrapper');
const AppError = require('../utils/custom.error');
const Bootcamp = require("../models/bootcamp.model");
const User = require('../models/user.model')

module.exports.getReviews = asyncErrorWrapper(async (req, res, next) => {
    const {bootCampId} = req.params;

    if (bootCampId) {
        let courses = await Review.find({bootcamp: bootCampId})
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
module.exports.getReview = asyncErrorWrapper(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError(`No review found with the id ${req.params.id}`, 400));

    return res.status(200).json({
        success: true,
        data: {
            data: review
        }
    })
});
module.exports.updateReview = asyncErrorWrapper(async function (req, res, next) {
    let review = await Review.findById(req.params.id);
    const userId = req.user.id

    if (!review) return next(new AppError(`No course found with the id ${req.params.id}`, 400));

    if(review.user.toString() !== userId && req.user.role !== 'admin'){
        return next(new AppError(`user ${userId} is not allowed to update resource ${req.params.id}`, 403));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    return res.status(200).json({
        success: true,
        data: {
            data: review
        }
    })
});
module.exports.deleteReview = asyncErrorWrapper(async function (req, res, next) {
    const userId = req.user.id
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError(`No course found with the id ${req.params.id}`, 400));

    if(review.user.toString() !== userId && req.user.role !== 'admin'){
        return next(new AppError(`user ${userId} is not allowed to update resource ${req.params.id}`, 403));
    }
    review.remove();
    return res.status(204).json({
        success: true,
        data: {
            data: review
        }
    })
});
module.exports.createReview = asyncErrorWrapper(async function (req, res, next) {
    const {bootCampId} = req.params;
    const bootcamp = await Bootcamp.findById(bootCampId);
    if (!bootcamp) return next(new AppError(`No bootcamp found with the id ${req.params.id}`, 404));

    req.body.bootcamp = bootcamp;
    req.body.user = req.user;
    const course = await Review.create(req.body);
    res.status(201).json({success: true, data: {data: course}});
});