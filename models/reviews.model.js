const mongoose = require('mongoose')
const baseSchema = require('./base.schema');
const reviewSchema = require('./review.schema.design');

const ReviewSchema = baseSchema(reviewSchema);

//constraint the review to only allow one user to review one bootcamp
ReviewSchema.index({user: 1, bootcamp: 1}, {unique: true})

module.exports = mongoose.model('Review', ReviewSchema)