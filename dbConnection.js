const mongoose = require('mongoose');
const colors = require('colors');

module.exports = async () => {
    const connection = await mongoose.connect(process.env.CONNECTION_STRING, {
        dbName: 'devCamper',
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(colors.brightMagenta.bold.underline(`mongoose up and running: ${connection.connection.host}`));
}