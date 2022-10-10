const asyncErrorWrapper = require('../utils/async.error.wrapper');
const AppError = require('../utils/custom.error');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const util = require('util');
const colors = require('colors');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.createSignInToken();
    const expireInMilliseconds = process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000;
    const options = {
        expires: new Date(Date.now() + expireInMilliseconds),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') options.secure = true

    res.status(statusCode).cookie('token', token, options).json({success: true, token})
}

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
module.exports.protect = asyncErrorWrapper(async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    let token;
    if(authorizationHeader && authorizationHeader.startsWith('Bearer')){
        token = authorizationHeader.split(' ')[1];
    }

    if(!token) return next(new AppError('You do not have access to this resource. Please sign in to get access', 401));

    const promisifiedVerify = util.promisify(jwt.verify);
    const decoded = await promisifiedVerify(token, process.env.JWT_ENCODING_SECRET);

    req.user = await User.findOne({_id: decoded.id});
    next();
})
module.exports.getMe = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({email: req.user.email});
    return res.status(200).json({
        success: true,
        data: {
            data: user
        }
    })
})
module.exports.restrictToRole = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) return next(new AppError(`the role [ ${req.user.role} ] not authorized to perform that action on this resource`, 403));
    next();
}