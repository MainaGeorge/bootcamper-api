const mongoose = require('mongoose');
const baseSchema = require('./base.schema');
const userSchema = require('./user.schema.design');

const UserSchema = baseSchema(userSchema);


module.exports = mongoose.model('User', UserSchema)