const mongoose = require('mongoose');
const dt = require('dotenv').config({
    path: './.env'
})
const Bootcamp = require('./models/bootcamp.model')
const colors = require('colors');
const fs = require('fs');
const path = require('path')

const bootcamps = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'bootcamps.json'), 'utf-8'));

mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: 'devCamper',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(colors.green.inverse('Database connected'));
    return Bootcamp.deleteMany()
}).then(() => {
    return Bootcamp.create(bootcamps);
}).then(() => {
    console.log(colors.green.bold('bootcamp seeded'));
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(1);
});
