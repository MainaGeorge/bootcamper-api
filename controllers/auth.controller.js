const asyncErrorWrapper = require('../utils/async.error.wrapper');
const AppError = require('../utils/custom.error');
const User = require('../models/user.model');

module.exports.registerUser = asyncErrorWrapper(async(req, res, next) => {
    const {name, email, role, password } = req.body;
    const user = await User.create({email, role, password, name})
    sendTokenResponse(user, 201, res)
});

module.exports.login = asyncErrorWrapper(async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) return next(new AppError('you must provide an email and a password', 400));

    const user = await User.findOne({email}).select('+password');

    if(!user) return next(new AppError('Invalid credentials', 401));

    const isMatch = await user.comparePasswords(password);

    if(!isMatch) return next(new AppError('Invalid credentials', 401));

    sendTokenResponse(user, 200, res)
})
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.createSignInToken();
    const expireInMilliseconds = process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000;
    const options = {
        expires: new Date(Date.now() + expireInMilliseconds),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({success: true, token})
}