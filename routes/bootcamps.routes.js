const router = require('express').Router();
const courseRouter = require('./courses.routes');
const Bootcamp = require('../models/bootcamp.model');
const shaperMiddleware = require('../middleware/res.shaper.middleware');

const {
  getBootcamps,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  findBootcampWithinDistance,
} = require("../controllers/bootcamps.controller");

router.use('/:bootCampId/courses', courseRouter);
router.get('/lat/:lat/long/:long/distance/:distance/unit/:unit',findBootcampWithinDistance);

router
    .route('/')
    .get(shaperMiddleware(Bootcamp, {
      path: 'courses',
      select: 'title tuition weeks'
    }), getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .delete(deleteBootcamp)
    .patch(updateBootcamp);

module.exports = router;