const express = require('express');
const morgan = require('morgan');
const devenv = require('dotenv').config({
    path: './.env'
});
const colors = require('colors');
const bootcampRouter = require('./routes/bootcamps.routes');
const connectDb = require('./dbConnection');
const errorMiddleware = require('./middleware/error.middleware')

const port = process.env.PORT || 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(`${process.env.API_VERSION}/bootcamps`, bootcampRouter);
app.use(errorMiddleware);

const server = app.listen(port, async () => {
    await connectDb();
    console.log(colors.brightYellow.bold(`server running on port ${port} in ${process.env.NODE_ENV}`));
});

process.on('unhandledRejection', (err) => {
    console.log(colors.red.bold(`an unhandled promise rejection occurred ${err.message}`));
    server.close( () => process.exit(1));
})