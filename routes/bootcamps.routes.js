const router = require('express').Router();
const {getBootcamps, getBootcamp, updateBootcamp, deleteBootcamp, createBootcamp} = require('../controllers/bootcamps.controller')

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .delete(deleteBootcamp)
    .patch(updateBootcamp);

module.exports = router;