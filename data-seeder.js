const mongoose = require('mongoose');
const dt = require('dotenv').config({
    path: './.env'
})
const colors = require('colors');
const fs = require('fs');
const path = require('path')
const Bootcamp = require('./models/bootcamp.model');
const Course = require('./models/course.model');
const User = require('./models/user.model');
const Review = require('./models/reviews.model')


const bootcamps = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'bootcamps.json'), 'utf-8'));
const courses = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'courses.json'), 'utf-8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'user.json'), 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'reviews.json'), 'utf-8'));

mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: 'devCamper',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(colors.green.inverse('Database connected'));
    return User.deleteMany()
}).then(() => {
    console.log(colors.red('Users deleted'))
    return User.create(users);
}).then(() => {
    console.log(colors.green.bold('Users seeded'));
    return Bootcamp.deleteMany()
}).then(() => {
    console.log(colors.red('Bootcamps deleted'))
    return Bootcamp.create(bootcamps)
}).then(() => {
    console.log(colors.green('Bootcamps seeded'))
    return Course.deleteMany()
}).then(() => {
    console.log(colors.red('Courses deleted'))
    return Course.create(courses);
}).then(() => {
    console.log(colors.green('Courses added'));
    return Review.deleteMany();
}).then(() => {
    console.log(colors.red('Reviews Deleted'));
    return Review.create(reviews);
}).then(() => {
    console.log(colors.green('Reviews seeded'))
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(1);
});
