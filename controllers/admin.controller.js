const User = require('../models/user.model')
const asyncErrorWrapper = require('../utils/async.error.wrapper');
const AppError = require('../utils/custom.error')

module.exports.getUsers = asyncErrorWrapper(async (req, res, next) => {
    return res.json({
        success: true,
        data: res.shapedData
    })
});
module.exports.getUser = asyncErrorWrapper(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user) return next(new AppError(`could not find user with id ${id}`, 404));

    return res.status(200).json({
        success: true,
        data: {
            data: user
        }
    })
});

module.exports.deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const id = req.params.id;
    if(req.user.id === id) return next(new AppError(`You can not delete yourself`, 400));
    const user = await User.findById(id);
    if(!user) return next(new AppError(`could not find user with id ${id}`, 404));

    await user.remove();
    return res.status(204).json({
        success: true,
        data: {}

    })
});

module.exports.updateUser = asyncErrorWrapper(async (req, res, next) => {
    const id = req.params.id;
    let user = await User.findById(id);
    if(!user) return next(new AppError(`could not find user with id ${id}`, 404));

    user = await User.findByIdAndUpdate(id, req.body, {
        returnDocument: 'after',
        runValidators: true
    });
    return res.status(200).json({
        success: true,
        data: {
            data: user
        }

    })
});

module.exports.createUser = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.create(req.body);

    return res.status(201).json({
        data: {
            data: user
        },
        success: true
    })
})