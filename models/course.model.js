const mongoose = require('mongoose');
const Bootcamp = require('./bootcamp.model');
const colors = require('colors')

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
    },
});

CourseSchema.statics.calculateAverageCourseCostInBootcamp = async function (bootcampId) {
    const avgResult = await this.aggregate([
        {$match: {bootcamp: bootcampId}},
        {$group: {_id: '$bootcamp', averageCost: {$avg: '$tuition'}}}
    ]);
    try{
        await Bootcamp.findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(avgResult[0].averageCost / 10) * 10
        })

    }catch(err){
        console.log(err)
    }
}

CourseSchema.post('save', async function(){
    await this.constructor.calculateAverageCourseCostInBootcamp(this.bootcamp._id);
})

CourseSchema.post('remove', async function(){
    await this.constructor.calculateAverageCourseCostInBootcamp(this.bootcamp);
})

module.exports = mongoose.model('Course', CourseSchema)