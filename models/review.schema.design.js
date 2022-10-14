const mongoose = require('mongoose');

module.exports = {
    title: {
        type: String,
        required: [true, 'please provide a title for your review'],
        maxlength: [100, 'the title can not exceed 100 characters']
    },
    text: {
        type: String,
        required: [true, 'please provide some description or text for your review'],
        maxlength: [1000, 'the text of a review can not exceed 1000 characters']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'a review must be associated with a user']
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: [true, 'a review must be made against a bootcamp']
    },
    rating: {
        type: Number,
        max: 10,
        min: 1,
        required: [true, 'a review must contain a rating between 1 and 10']
    }
}