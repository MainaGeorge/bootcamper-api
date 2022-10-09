const asyncErrorWrapper = require('../utils/async.error.wrapper');
const AppError = require('../utils/custom.error');
const User = require('../models/user.model');

module.exports.registerUser = asyncErrorWrapper(async(req, res, next) => {
    res.status(200).json({success: true})
});