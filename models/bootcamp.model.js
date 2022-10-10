const mongoose = require('mongoose');
const slugify = require('slugify');
const geocode = require('../utils/geocode');
const baseSchema = require('./base.schema');
const bootcampSchema = require('./bootcamp.schema.design');

const BootcampSchema = baseSchema(bootcampSchema);

BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true})
    next()
});

BootcampSchema.pre('save', async function (next) {
    if (!this.address) return next();
    const geocodedDataResponse = await geocode(this.address);
    if(!geocodedDataResponse || !Array.isArray(geocodedDataResponse.data)) return next();
    const geoCoded = geocodedDataResponse.data[0]
    this.location = {
        type: 'Point',
        coordinates: [geoCoded.longitude, geoCoded.latitude],
        formattedAddress: geoCoded.name,
        street: geoCoded.street,
        city: geoCoded.locality,
        state: geoCoded.county,
        zipcode: geoCoded.postal_code,
        country: geoCoded.country,
    }
    this.address = undefined;
    next();
});

BootcampSchema.pre('remove', async function(next){
    await this.model('Course').deleteMany({bootcamp: this._id});
    next();
});

BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);