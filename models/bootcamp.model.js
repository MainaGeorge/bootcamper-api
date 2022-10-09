const mongoose = require('mongoose');
const slugify = require('slugify');
const geocode = require('../utils/geocode');
const schema = require('./base.schema');

const bootcampSchema = {
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [500, "Description can not be more than 500 characters"],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
            "Please use a valid URL with HTTP or HTTPS",
        ],
    },
    phone: {
        type: String,
        maxlength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
        type: String,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    address: {
        type: String,
        required: [true, "Please add an address"],
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            index: "2dsphere",
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: ["Web Development", "Mobile Development", "UI/UX", "Data Science", "Business", "Other"],
    },
    averageRating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: "no-photo.jpg",
    },
    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGuarantee: {
        type: Boolean,
        default: false,
    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}
const BootcampSchema = schema(bootcampSchema);

BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true})
    next()
});

BootcampSchema.pre('save', async function (next) {
    if (!this.address) return next();
    const geocodedDataResponse = await geocode(this.address);
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
    foreignField: 'bootcamp'
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);