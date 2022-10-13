const asyncErrorWrapper = require('../utils/async.error.wrapper');
const AppError = require('../utils/custom.error');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const util = require('util');
const colors = require('colors');
const crypto = require('crypto');
const sendEmail = require('../utils/email')

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

module.exports.forgotPassword = asyncErrorWrapper(async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) return next(new AppError(`No user with that email exists in our database`, 400));

    const resetToken = await user.getResetPasswordToken();
    const resetUrl = `${req.protocol}://${req.get('host')}${process.env.API_VERSION}/auth/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });
        res.status(200).json({ success: true, data: 'Email sent' });
    }
    catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('Email could not be sent', 500));
    }
});

module.exports.resetPassword = asyncErrorWrapper(async(req, res, next) => {
    const resetToken = req.params.resetToken;
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log(colors.green(hashedToken))
    const user = await User.findOne({resetPasswordToken: hashedToken, resetPasswordExpire: {$gt: new Date().toISOString()}});

    if(!user) return next(new AppError(`The token is expired. Please get another one`, 400))
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendTokenResponse(user, 200, res);
});

module.exports.updatePassword = asyncErrorWrapper(async (req, res, next) => {
    const {password, newPassword } = req.body;
    let user = await User.findById(req.user.id).select('+password');

    if(!user) return next(new AppError(`user not found`, 404));
    if(!(await user.comparePasswords(password))) return next(new AppError(`incorrect password, please try again`, 400))

    user.password = newPassword;
    user = await user.save();
    return sendTokenResponse(user, 200, res);
})

