const Bootcamp = require('../models/bootcamp.model');
const AppError = require('../utils/custom.error');
const asyncErrorWrapper = require('../utils/async.error.wrapper');

module.exports.getBootcamps = asyncErrorWrapper(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: res.shapedData
    })
});

module.exports.getBootcamp = asyncErrorWrapper(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate({
        path: 'courses',
        select: 'title tuition weeks'
    });

    if(!bootcamp){
        return next(new AppError(`Could not find resource with the id ${req.params.id}`, 400));
    }

    return res.status(200).json({
        success: true,
        data: {
            bootcamp
        }
    })
});

module.exports.createBootcamp = asyncErrorWrapper(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data:{data: bootcamp}  });
});

module.exports.updateBootcamp = asyncErrorWrapper(async(req, res, next) => {
    const updated = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        returnDocument: 'after'
    })

    if(!updated){
        return next(new AppError(`could not find resource with id ${req.params.id}`, 400))
    }

    return res.status(200).json({
        success: true,
        data: {
            data: updated
        }
    })
});

module.exports.deleteBootcamp = asyncErrorWrapper(async(req, res, next) => {
    const deleted = await Bootcamp.findById(req.params.id, {
        runValidators: true,
        new: true
    })

    if(!deleted){
        return next(new AppError(`could not find resource with id ${req.params.id}`, 400))
    }

    deleted.remove();

    return res.status(204).json({
        success: true,
        data: {
            data: deleted
        }
    })
});

module.exports.findBootcampWithinDistance = asyncErrorWrapper(async (req, res, next) => {
    // unit=mi or km --> default km radius;
    // the radians should be in radians using the radius of the earth as the ref, hence the division by 3963 for miles and 6378 for km
    const { distance, lat, long, unit } = req.params;
    const radius = unit === 'mi' ? +distance * 0.62137 / 3963: +distance/6378;

    const bootcamps = await Bootcamp.find({
        location:
        {
            $geoWithin: { $centerSphere: [[+long, +lat], radius ]}
        }
    })
    
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: {
            data: bootcamps
        }
    })
});


