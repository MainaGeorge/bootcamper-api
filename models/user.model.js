const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const baseSchema = require('./base.schema');
const userSchema = require('./user.schema.design');

const UserSchema = baseSchema(userSchema);

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.createSignInToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_ENCODING_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

UserSchema.methods.comparePasswords = async function(password){
    return await bcrypt.compare(password, this.password)
}
module.exports = mongoose.model('User', UserSchema)