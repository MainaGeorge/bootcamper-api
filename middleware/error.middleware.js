const colors = require('colors');
const ApiError = require('../utils/custom.error')

module.exports = function (err, req, res, next) {
    // console.log(colors.red(err));
    let error = Object.assign(err, {})

    if (err.name === "ValidationError") {
        const errObj = err.errors;
        const message = Object.keys(errObj).map(e => errObj[e].message)
        error = new ApiError(message, 400);
    } else if(err.name === "CastError"){
        error = new ApiError(`the id ${err.value} can not be casted into a valid mongo ObjectId`, 400)
    } else if(err.code === 11000){
        const message = `the field [ ${err.keyValue.name} ] is not allowed to be duplicate`;
        error = new ApiError(message, 400)
    }
      
    res.status(error.httpStatus || 500).json({ success: false, message: error.message});
}