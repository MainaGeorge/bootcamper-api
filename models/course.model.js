const mongoose = require('mongoose');
const Bootcamp = require('./bootcamp.model');
const baseSchema = require('./base.schema');
const colors = require('colors');
const courseSchema = require('./course.schema.design');

const CourseSchema = baseSchema(courseSchema);

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