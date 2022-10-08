const router = require('express').Router();
const courseRouter = require('./courses.routes');
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
    .get(getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .delete(deleteBootcamp)
    .patch(updateBootcamp);

module.exports = router;