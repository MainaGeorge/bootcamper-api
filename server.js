const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config({
    path: './.env'
});
const colors = require('colors');
const bootcampRouter = require('./routes/bootcamps.routes');
const courseRouter = require('./routes/courses.routes');
const userRouter = require('./routes/auth.route');
const connectDb = require('./dbConnection');
const errorMiddleware = require('./middleware/error.middleware')

const port = process.env.PORT || 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(`${process.env.API_VERSION}/bootcamps`, bootcampRouter);
app.use(`${process.env.API_VERSION}/courses`, courseRouter);
app.use(`${process.env.API_VERSION}/auth`, userRouter);
app.use(errorMiddleware);

const server = app.listen(port, async () => {
    await connectDb();
    console.log(colors.yellow.bold(`server running on port ${port} in ${port}`));
});

process.on('unhandledRejection', (err) => {
    console.log(colors.red.bold(`an unhandled promise rejection occurred ${err.message}`));
    server.close( () => process.exit(1));
})