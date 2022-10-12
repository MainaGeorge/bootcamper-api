const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const baseSchema = require('./base.schema');
const userSchema = require('./user.schema.design');
const crypto = require('crypto');

const UserSchema = baseSchema(userSchema);

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.createSignInToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_ENCODING_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

UserSchema.methods.comparePasswords = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    //set the hashed version of the token and its expiry time (10 min)
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 60;

    await this.save();
    return resetToken;
}
module.exports = mongoose.model('User', UserSchema)