const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'please provide a title for your course'],
        maxlength: [50, 'title can not be more than 50 characters'],
        trim: true
    },
    description: {
        type: String,
        required: ['true', 'please provide a description for your course'],
    },
    weeks: {
        type: String,
        required: [true, 'please provide the duration of the course in weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'please provide the amount of tuition fee payable for the course']
    },
    minimumSkill: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'please provide a the minimum skill required']
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
}, {
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id;
            return ret;
        }
    },});

module.exports = mongoose.model('Course', CourseSchema)